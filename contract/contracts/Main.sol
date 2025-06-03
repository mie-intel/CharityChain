// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "hardhat/console.sol";

library Date {
    function getCurrentTimestamp() internal view returns (uint) {
        console.log("Date.getCurrentTimestamp() called, returning:", block.timestamp);
        return block.timestamp;
    }

    function isFuture(uint timestamp) internal view returns (bool) {
        bool result = timestamp > block.timestamp;
        console.log("Date.isFuture(%d) called, returning:", timestamp, result);
        return result;
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
        bool finished;
    }
    
    struct User {
        string userId;
        uint[] campaigns;
        uint balance;
    }
    
    mapping(uint => Campaign) public campaigns;
    mapping(string => User) users;
    mapping(string => bool) public userExists;
    string[] public allUserIds;
    
    uint public totalCampaignsCount = 0;
    
    event UserCreated(string indexed userId, address indexed userAddress, uint initialBalance, uint timestamp);
    event UserBalanceUpdated(string indexed userId, address indexed userAddress, uint newBalance, uint amount, string action, uint timestamp);
    event CampaignCreated(uint indexed campaignId, string indexed userId, address indexed creator, string title, uint target, uint duration, uint startTime);
    event CampaignFinished(uint indexed campaignId, string indexed userId, address indexed creator, string reason, uint finalMilestone, uint timestamp);
    event DonationMade(uint indexed campaignId, string indexed donorUserId, address indexed donorAddress, uint amount, uint newMilestone, uint targetProgress, uint timestamp);
    event CampaignWithdrawal(uint indexed campaignId, string indexed userId, address indexed userAddress, uint amount, uint remainingMilestone, uint timestamp);
    event MilestoneReached(uint indexed campaignId, string indexed userId, uint milestone, uint target, bool campaignCompleted, uint timestamp);
    
    function createUser(string memory userId, uint initialBalance) public {
        console.log("createUser called with userId:", userId, "initialBalance:", initialBalance);
        console.log("Checking if user exists...");
        require(!userExists[userId], "User already exists");
        require(bytes(userId).length > 0, "User ID cannot be empty");

        console.log("Creating new user...");
        users[userId] = User({
            userId: userId,
            campaigns: new uint[](0),
            balance: initialBalance
        });
        
        userExists[userId] = true;
        allUserIds.push(userId);
        console.log("User created successfully:", userId);
        
        emit UserCreated(userId, msg.sender, initialBalance, block.timestamp);
    }

    function getAllUser() public {
        console.log("getAllUser called");
        User[] memory allUsers = new User[](allUserIds.length);
        console.log("Total users:", allUserIds.length);
        for (uint i = 0; i < allUserIds.length; i++) {
            allUsers[i] = users[allUserIds[i]];
            console.log("User ID:", allUserIds[i], "Balance:", allUsers[i].balance);
        }
    }

    fallback() external {
        console.log("Fallback function called with value:");
    }

    function topUpUser(string memory userId, uint amount) public {
        console.log("topUpUser called for userId:", userId, "amount:", amount);
        require(userExists[userId], "User does not exist");
        require(amount > 0, "Amount must be greater than 0");
        
        console.log("Current balance before topup:", users[userId].balance);
        users[userId].balance += amount;
        console.log("New balance after topup:", users[userId].balance);
        
        emit UserBalanceUpdated(userId, msg.sender, users[userId].balance, amount, "topup", block.timestamp);
    }

    function withDraw(string memory userId, uint amount) public {
        console.log("withDraw called for userId:", userId, "amount:", amount);
        require(userExists[userId], "User does not exist");
        require(amount > 0, "Amount must be greater than 0");
        
        User storage user = users[userId];
        console.log("Current balance before withdrawal:", user.balance);
        require(user.balance >= amount, "Insufficient balance");
        
        user.balance -= amount;
        console.log("New balance after withdrawal:", user.balance);
        
        emit UserBalanceUpdated(userId, msg.sender, user.balance, amount, "withdraw", block.timestamp);
    }

    function withDrawFromCampaign(uint campaignId, uint amount) public {
        console.log("withDrawFromCampaign called for campaignId:", campaignId, "amount:", amount);
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        Campaign storage campaign = campaigns[campaignId];
        
        console.log("Checking campaign ownership...");
        require(campaign.user == msg.sender, "Only campaign owner can withdraw");
        require(!campaign.finished, "Campaign already finished");
        require(amount > 0 && amount <= campaign.milestone, "Invalid withdrawal amount");
        
        console.log("Current milestone before withdrawal:", campaign.milestone);
        campaign.milestone -= amount;
        console.log("New milestone after withdrawal:", campaign.milestone);
        
        emit CampaignWithdrawal(campaignId, campaign.userId, msg.sender, amount, campaign.milestone, block.timestamp);
    }

    function donate(string memory userId, uint campaignId, uint amount) public {
        // console.log("donate called by userId:", "to campaignId:", campaignId, "amount:", amount);
        require(userExists[userId], "User does not exist");
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        require(amount > 0, "Amount must be greater than 0");
        
        User storage user = users[userId];
        Campaign storage campaign = campaigns[campaignId];
        
        require(!campaign.finished, "Campaign already finished");
        console.log("Donor balance:", user.balance);
        require(user.balance >= amount, "Insufficient balance");
        
        console.log("Processing donation...");
        user.balance -= amount;
        uint oldMilestone = campaign.milestone;
        
        updateCampaignMilestone(campaignId, amount);
        
        uint progressPercentage = (campaign.milestone * 10000) / campaign.target;
        console.log("New campaign milestone:", campaign.milestone);
        console.log("Progress percentage:", progressPercentage);
        
        emit DonationMade(campaignId, userId, msg.sender, amount, campaign.milestone, progressPercentage, block.timestamp);
        
        if (campaign.milestone != oldMilestone) {
            console.log("Milestone changed, emitting event...");
            emit MilestoneReached(campaignId, campaign.userId, campaign.milestone, campaign.target, campaign.finished, block.timestamp);
        }
    }

    function updateCampaignMilestone(uint campaignId, uint amount) internal {
        console.log("updateCampaignMilestone called for campaignId:", campaignId, "amount:", amount);
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        
        Campaign storage campaign = campaigns[campaignId];
        console.log("Current milestone before update:", campaign.milestone);
        campaign.milestone += amount;
        console.log("New milestone after update:", campaign.milestone);

        if(campaign.milestone >= campaign.target) {
            console.log("Target reached! Finishing campaign...");
            campaign.finished = true;
            
            emit CampaignFinished(campaignId, campaign.userId, campaign.user, "target_reached", campaign.milestone, block.timestamp);
        }
    }

    function getUser(string memory userId) public view returns (User memory) {
        console.log("getUser called for userId:", userId);
        require(userExists[userId], "User does not exist");
        return users[userId];
    }
    
    function getUserCampaignStats(string memory userId) public view returns (uint total, uint active, uint finished) {
        console.log("getUserCampaignStats called for userId:", userId);
        require(userExists[userId], "User does not exist");
        
        uint[] memory userCampaignIds = users[userId].campaigns;
        total = userCampaignIds.length;
        console.log("Total campaigns:", total);
        
        for (uint i = 0; i < userCampaignIds.length; i++) {
            if (campaigns[userCampaignIds[i]].finished) {
                finished++;
                console.log("Campaign", userCampaignIds[i], "is finished");
            } else {
                active++;
                console.log("Campaign", userCampaignIds[i], "is active");
            }
        }
    }
    
    function createCampaign(string memory userId, string memory title, uint duration, uint target, uint milestone) public {
        console.log("createCampaign called by userId:", userId, "title:", title);
        require(userExists[userId], "User does not exist");
        require(duration > 0, "Duration must be greater than 0");
        require(target > 0, "Target must be greater than 0");
        require(bytes(title).length > 0, "Title cannot be empty");
        
        totalCampaignsCount++;
        uint campaignId = totalCampaignsCount;
        console.log("Creating new campaign with ID:", campaignId);
        
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
        console.log("Campaign created successfully. Total campaigns now:", totalCampaignsCount);
        
        emit CampaignCreated(campaignId, userId, msg.sender, title, target, duration, block.timestamp);
    }
    
    function finishCampaign(uint campaignId) public {
        console.log("finishCampaign called for campaignId:", campaignId);
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        require(campaigns[campaignId].user == msg.sender, "Only campaign owner can finish");
        require(!campaigns[campaignId].finished, "Campaign already finished");
        
        Campaign storage campaign = campaigns[campaignId];
        campaign.finished = true;
        console.log("Campaign marked as finished");
        
        string memory reason = "manual_finish";
        if (isCampaignExpired(campaignId)) {
            reason = "expired";
            console.log("Campaign expired");
        }
        
        emit CampaignFinished(campaignId, campaign.userId, msg.sender, reason, campaign.milestone, block.timestamp);
    }
    
    function isCampaignExpired(uint campaignId) public view returns (bool) {
        console.log("isCampaignExpired called for campaignId:", campaignId);
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        
        Campaign memory campaign = campaigns[campaignId];
        bool expired = (block.timestamp >= campaign.startTime + campaign.duration);
        console.log("Campaign expired status:", expired);
        return expired;
    }
    
    function getAllCampaigns(string memory userId) public view returns (Campaign[] memory) {
        console.log("getAllCampaigns called for userId:", userId);
        if (bytes(userId).length == 0) {
            console.log("No userId provided, returning all campaigns");
            return getAllCampaignsGlobal();
        }
        
        require(userExists[userId], "User does not exist");
        
        uint[] memory userCampaignIds = users[userId].campaigns;
        Campaign[] memory userCampaigns = new Campaign[](userCampaignIds.length);
        console.log("User has", userCampaignIds.length, "campaigns");
        
        for (uint i = 0; i < userCampaignIds.length; i++) {
            userCampaigns[i] = campaigns[userCampaignIds[i]];
        }
        
        return userCampaigns;
    }
    
    function getAllCampaignsGlobal() public view returns (Campaign[] memory) {
        console.log("getAllCampaignsGlobal called. Total campaigns:", totalCampaignsCount);
        Campaign[] memory allCampaigns = new Campaign[](totalCampaignsCount);
        
        for (uint i = 1; i <= totalCampaignsCount; i++) {
            allCampaigns[i-1] = campaigns[i];
        }
        
        return allCampaigns;
    }
    
    function getCampaignsByStatus(string memory userId, bool finished) public view returns (Campaign[] memory) {
        console.log("getCampaignsByStatus called for userId:", userId, "finished:", finished);
        Campaign[] memory allUserCampaigns = getAllCampaigns(userId);
        
        uint matchingCount = 0;
        for (uint i = 0; i < allUserCampaigns.length; i++) {
            if (allUserCampaigns[i].finished == finished) {
                matchingCount++;
            }
        }
        console.log("Found", matchingCount, "matching campaigns");
        
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
    
    function getCampaign(uint campaignId) public view returns (Campaign memory) {
        console.log("getCampaign called for campaignId:", campaignId);
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        return campaigns[campaignId];
    }
    
    function getCampaignProgress(uint campaignId) public view returns (uint percentage) {
        console.log("getCampaignProgress called for campaignId:", campaignId);
        require(campaignId > 0 && campaignId <= totalCampaignsCount, "Invalid campaign ID");
        Campaign memory campaign = campaigns[campaignId];
        
        if (campaign.target == 0) {
            console.log("Target is 0, returning 0");
            return 0;
        }
        
        percentage = (campaign.milestone * 10000) / campaign.target;
        if (percentage > 10000) percentage = 10000;
        console.log("Progress percentage:", percentage);
    }
}