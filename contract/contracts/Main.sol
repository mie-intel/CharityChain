// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

library Date{
    function getCurrentTimestamp() internal view returns (uint) {
        return block.timestamp;
    }

    function isFuture(uint timestamp) internal view returns (bool) {
        return timestamp > block.timestamp;
    }
}

contract Main {
    struct Campaign {
        string userId;
        address user;
        string title;
        uint duration;
        uint startTime;
        uint target;
        uint milestone;
        bool finished; // Status apakah campaign sudah selesai
    }
    
    struct User {
        string userId;
        uint[] campaigns;
        uint balance;
    }
    
    mapping(uint => Campaign) public campaigns;
    mapping(string => User) users;
    mapping(string => bool) public userExists;
    
    uint public totalCampaignsCount = 0;
    
    // Events untuk tracking dengan indexed parameters untuk filtering
    event UserCreated(
        string indexed userId, 
        address indexed userAddress, 
        uint initialBalance,
        uint timestamp
    );
    
    event UserBalanceUpdated(
        string indexed userId,
        address indexed userAddress,
        uint newBalance,
        uint amount,
        string action, // "topup" or "withdraw"
        uint timestamp
    );
    
    event CampaignCreated(
        uint indexed campaignId, 
        string indexed userId, 
        address indexed creator,
        string title,
        uint target,
        uint duration,
        uint startTime
    );
    
    event CampaignFinished(
        uint indexed campaignId, 
        string indexed userId,
        address indexed creator,
        string reason, // "target_reached", "manual_finish", or "expired"
        uint finalMilestone,
        uint timestamp
    );
    
    event DonationMade(
        uint indexed campaignId,
        string indexed donorUserId,
        address indexed donorAddress,
        uint amount,
        uint newMilestone,
        uint targetProgress, // percentage * 100 (e.g., 5000 = 50%)
        uint timestamp
    );
    
    event CampaignWithdrawal(
        uint indexed campaignId,
        string indexed userId,
        address indexed userAddress,
        uint amount,
        uint remainingMilestone,
        uint timestamp
    );
    
    event MilestoneReached(
        uint indexed campaignId,
        string indexed userId,
        uint milestone,
        uint target,
        bool campaignCompleted,
        uint timestamp
    );
    
    function createUser(string memory userId, uint initialBalance) public {
        require(!userExists[userId], "User already exists");
        require(bytes(userId).length > 0, "User ID cannot be empty");
        
        users[userId] = User({
            userId: userId,
            campaigns: new uint[](0),
            balance: initialBalance
        });
        
        userExists[userId] = true;
        
        emit UserCreated(userId, msg.sender, initialBalance, block.timestamp);
    }

    function topUpUser(string memory userId, uint amount) public {
        require(userExists[userId], "User does not exist");
        require(amount > 0, "Amount must be greater than 0");
        
        users[userId].balance += amount;
        
        emit UserBalanceUpdated(
            userId, 
            msg.sender, 
            users[userId].balance, 
            amount, 
            "topup", 
            block.timestamp
        );
    }

    function withDraw(string memory userId, uint amount) public {
        require(userExists[userId], "User does not exist");
        require(amount > 0, "Amount must be greater than 0");
        
        User storage user = users[userId];
        require(user.balance >= amount, "Insufficient balance");
        
        user.balance -= amount;
        
        emit UserBalanceUpdated(
            userId, 
            msg.sender, 
            user.balance, 
            amount, 
            "withdraw", 
            block.timestamp
        );
        
        // Logic untuk transfer ke alamat pengguna bisa ditambahkan di sini
    }

    function withDrawFromCampaign(uint campaignId, uint amount) public {
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        Campaign storage campaign = campaigns[campaignId];
        
        require(campaign.user == msg.sender, "Only campaign owner can withdraw");
        require(!campaign.finished, "Campaign already finished");
        require(amount > 0 && amount <= campaign.milestone, "Invalid withdrawal amount");
        
        campaign.milestone -= amount;
        
        emit CampaignWithdrawal(
            campaignId,
            campaign.userId,
            msg.sender,
            amount,
            campaign.milestone,
            block.timestamp
        );
        
        // Logic untuk transfer ke alamat pengguna bisa ditambahkan di sini
    }

    function donate(string memory userId, uint campaignId, uint amount) public {
        require(userExists[userId], "User does not exist");
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        require(amount > 0, "Amount must be greater than 0");
        
        User storage user = users[userId];
        Campaign storage campaign = campaigns[campaignId];
        
        require(!campaign.finished, "Campaign already finished");
        require(user.balance >= amount, "Insufficient balance");
        
        user.balance -= amount;
        uint oldMilestone = campaign.milestone;
        
        updateCampaignMilestone(campaignId, amount);
        
        // Calculate progress percentage (multiply by 10000 for 2 decimal precision)
        uint progressPercentage = (campaign.milestone * 10000) / campaign.target;
        
        emit DonationMade(
            campaignId,
            userId,
            msg.sender,
            amount,
            campaign.milestone,
            progressPercentage,
            block.timestamp
        );
        
        // Emit milestone reached event if significant milestone
        if (campaign.milestone != oldMilestone) {
            emit MilestoneReached(
                campaignId,
                campaign.userId,
                campaign.milestone,
                campaign.target,
                campaign.finished,
                block.timestamp
            );
        }
    }

    function updateCampaignMilestone(uint campaignId, uint amount) internal {
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        
        Campaign storage campaign = campaigns[campaignId];
        campaign.milestone += amount;

        if(campaign.milestone >= campaign.target) {
            campaign.finished = true;
            
            emit CampaignFinished(
                campaignId, 
                campaign.userId, 
                campaign.user,
                "target_reached",
                campaign.milestone,
                block.timestamp
            );
        }
    }

    function getUser(string memory userId) public view returns (User memory) {
        require(userExists[userId], "User does not exist");
        return users[userId];
    }
    
    function getUserCampaignStats(string memory userId) public view returns (
        uint total,
        uint active,
        uint finished
    ) {
        require(userExists[userId], "User does not exist");
        
        uint[] memory userCampaignIds = users[userId].campaigns;
        total = userCampaignIds.length;
        
        for (uint i = 0; i < userCampaignIds.length; i++) {
            if (campaigns[userCampaignIds[i]].finished) {
                finished++;
            } else {
                active++;
            }
        }
    }
    
    function createCampaign(
        string memory userId,
        string memory title,
        uint duration,
        uint target,
        uint milestone
    ) public {
        require(userExists[userId], "User does not exist");
        require(duration > 0, "Duration must be greater than 0");
        require(target > 0, "Target must be greater than 0");
        require(bytes(title).length > 0, "Title cannot be empty");
        
        totalCampaignsCount++;
        uint campaignId = totalCampaignsCount;
        
        campaigns[campaignId] = Campaign({
            userId: userId,
            user: msg.sender,
            title: title,
            duration: duration,
            startTime: block.timestamp,
            target: target,
            milestone: milestone,
            finished: false
        });
        
        users[userId].campaigns.push(campaignId);
        
        emit CampaignCreated(
            campaignId, 
            userId, 
            msg.sender,
            title,
            target,
            duration,
            block.timestamp
        );
    }
    
    function finishCampaign(uint campaignId) public {
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        require(campaigns[campaignId].user == msg.sender, "Only campaign owner can finish");
        require(!campaigns[campaignId].finished, "Campaign already finished");
        
        Campaign storage campaign = campaigns[campaignId];
        campaign.finished = true;
        
        string memory reason = "manual_finish";
        if (isCampaignExpired(campaignId)) {
            reason = "expired";
        }
        
        emit CampaignFinished(
            campaignId, 
            campaign.userId,
            msg.sender,
            reason,
            campaign.milestone,
            block.timestamp
        );
    }
    
    function isCampaignExpired(uint campaignId) public view returns (bool) {
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        
        Campaign memory campaign = campaigns[campaignId];
        return (block.timestamp >= campaign.startTime + campaign.duration);
    }
    
    function getAllCampaigns(string memory userId) public view returns (Campaign[] memory) {
        if (bytes(userId).length == 0) {
            return getAllCampaignsGlobal();
        }
        
        require(userExists[userId], "User does not exist");
        
        uint[] memory userCampaignIds = users[userId].campaigns;
        Campaign[] memory userCampaigns = new Campaign[](userCampaignIds.length);
        
        for (uint i = 0; i < userCampaignIds.length; i++) {
            userCampaigns[i] = campaigns[userCampaignIds[i]];
        }
        
        return userCampaigns;
    }
    
    function getAllCampaignsGlobal() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](totalCampaignsCount);
        
        for (uint i = 1; i <= totalCampaignsCount; i++) {
            allCampaigns[i-1] = campaigns[i];
        }
        
        return allCampaigns;
    }
    
    function getCampaignsByStatus(string memory userId, bool finished) public view returns (Campaign[] memory) {
        Campaign[] memory allUserCampaigns = getAllCampaigns(userId);
        
        uint matchingCount = 0;
        for (uint i = 0; i < allUserCampaigns.length; i++) {
            if (allUserCampaigns[i].finished == finished) {
                matchingCount++;
            }
        }
        
        Campaign[] memory filteredCampaigns = new Campaign[](matchingCount);
        uint index = 0;
        
        for (uint i = 0; i < allUserCampaigns.length; i++) {
            if (allUserCampaigns[i].finished == finished) {
                filteredCampaigns[index] = allUserCampaigns[i];
                index++;
            }
        }
        
        return filteredCampaigns;
    }
    
    function getActiveCampaigns(string memory userId) public view returns (Campaign[] memory) {
        return getCampaignsByStatus(userId, false);
    }
    
    function getFinishedCampaigns(string memory userId) public view returns (Campaign[] memory) {
        return getCampaignsByStatus(userId, true);
    }
    
    function getCampaign(uint campaignId) public view returns (Campaign memory) {
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        return campaigns[campaignId];
    }
    
    // Helper function untuk mendapatkan progress campaign dalam percentage
    function getCampaignProgress(uint campaignId) public view returns (uint percentage) {
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        Campaign memory campaign = campaigns[campaignId];
        
        if (campaign.target == 0) return 0;
        
        percentage = (campaign.milestone * 10000) / campaign.target; // 2 decimal precision
        if (percentage > 10000) percentage = 10000; // Cap at 100%
    }
}