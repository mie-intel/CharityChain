// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "hardhat/console.sol";

library Date {
    function getCurrentTimestamp() internal view returns (uint) {
        return block.timestamp;
    }
}

contract Main {
    struct Campaign {
        address owner;
        string title;
        uint duration;
        uint startTime;
        int256 target;
        int256 milestone; // Represents current amount raised
        bool finished;
    }

    struct CampaignWithId {
        address id;
        address owner;
        string title;
        uint duration;
        uint startTime;
        int256 target;
        int256 milestone;
        bool finished;
    }

    
    struct User {
        address userId; // The address of the user
        address[] campaigns; // Array of campaign IDs (addresses) created by this user
        int256 balance; // User's balance for donations
    }
    
    mapping(address => Campaign) public campaigns; // Maps campaignId (address) to Campaign struct
    mapping(address => User) public users; // Maps user address to User struct
    mapping(address => bool) public userExists; // Checks if a user address exists
    mapping(address => bool) public campaignExists; // Checks if a campaignId (address) exists

    address[] public allUserIds; // Array of all user addresses
    address[] public allCampaignIds; // Array of all campaign IDs (addresses)
    
    event UserCreated(address indexed userId, address indexed creatorAddress, int256 initialBalance, uint timestamp);
    event UserBalanceUpdated(address indexed userId, address indexed actorAddress, int256 newBalance, int256 amount, string action, uint timestamp);
    event CampaignCreated(address indexed campaignId, address indexed creator, string title, int256 target, uint duration, uint startTime);
    event CampaignFinished(address indexed campaignId, address indexed owner, string reason, int256 finalMilestone, uint timestamp);
    event DonationMade(address indexed campaignId, address indexed donorUserId, address indexed donorWalletAddress, int256 amount, int256 newMilestone, int256 targetProgress, uint timestamp);
    event CampaignWithdrawal(address indexed campaignId, address indexed owner, address indexed withdrawerAddress, int256 amount, int256 remainingMilestone, uint timestamp);
    event MilestoneReached(address indexed campaignId, address indexed owner, int256 newMilestone, int256 target, bool campaignCompleted, uint timestamp);
    
    function address2str(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function int2str(int256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        
        bool negative = _i < 0;
        uint256 absValue = negative ? uint256(-_i) : uint256(_i);
        
        // Calculate string length
        uint256 temp = absValue;
        uint256 length = negative ? 1 : 0; // Start with 1 if negative for the '-' sign
        while (temp != 0) {
            length++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(length);
        
        // Fill the string from right to left
        while (absValue != 0) {
            length--;
            buffer[length] = bytes1(uint8(48 + absValue % 10));
            absValue /= 10;
        }
        
        // Add negative sign at the beginning
        if (negative) {
            buffer[0] = "-";
        }
        
        return string(buffer);
    }

    function createManyUsers(address[] memory userIds, int256[] memory initialBalance) public {
        for (uint i = 0; i < userIds.length; i++) {
            address userId = userIds[i];
            console.log("Processing user at index %d: Address: %s", i, userId);
            if (!userExists[userId]) {
                createUser(userId, initialBalance[i]);
            } else {
                console.log("User %s already exists, skipping creation.", userId);
            }
        }
        console.log("END: createManyUsers finished.");
    }

    function createUser(address userId, int256 initialBalance) public {
        require(!userExists[userId], "User already exists");
        require(userId != address(0), "User ID cannot be the zero address");

        console.log("User %s does not exist. Creating new user...", userId);
        users[userId] = User({
            userId: userId,
            campaigns: new address[](0),
            balance: initialBalance
        });
        
        userExists[userId] = true;
        allUserIds.push(userId);
        console.log("User %s created successfully. Total users in allUserIds: %d", userId, allUserIds.length);
        
        emit UserCreated(userId, msg.sender, initialBalance, Date.getCurrentTimestamp());
        console.log("END: createUser for %s finished.", userId);
    }

    // function getAllUserStructs() public view returns (User[] memory) {
    //     console.log("START: getAllUserStructs called. Total users to fetch: %d", allUserIds.length);
    //     User[] memory allUsersArray = new User[](allUserIds.length);
    //     for (uint i = 0; i < allUserIds.length; i++) {
    //         allUsersArray[i] = users[allUserIds[i]];
    //     }
    //     console.log("END: getAllUserStructs finished. Returning %d user structs.", allUsersArray.length);
    //     return allUsersArray;
    // }

    fallback() external{
        console.log("Fallback function triggered by:");
    }

    function topUpUser(address userId, int256 amount) public {
        require(userExists[userId], "User does not exist");
        require(amount > 0, "Amount must be greater than 0");
        
        users[userId].balance += amount;
        
        emit UserBalanceUpdated(userId, msg.sender, users[userId].balance, amount, "topup", Date.getCurrentTimestamp());
        console.log("END: topUpUser for %s finished.", userId);
    }

    // function withDrawUserBalance(address userId, int256 amount) public {
    //     require(userExists[userId], "User does not exist");
    //     require(amount > 0, "Amount must be greater than 0");
        
    //     User storage user = users[userId];
    //     require(user.balance >= amount, "Insufficient balance");

        
    //     user.balance -= amount;
        
    //     emit UserBalanceUpdated(userId, msg.sender, user.balance, amount, "withdraw_balance", Date.getCurrentTimestamp());
    //     console.log("END: withDrawUserBalance for %s finished.", userId);
    // }

    function withDrawFromCampaign(address campaignId, address userId, int256 amount) public {
        require(campaignExists[campaignId], "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        
        require(campaign.finished, "Campaign not finished!");
        require(amount > 0 && amount <= campaign.milestone, "Invalid withdrawal amount or not enough funds raised");
        console.log(campaign.finished);
        campaign.milestone -= amount;
        User storage user = users[userId];
        require(userExists[userId], "User does not exist");
        user.balance += amount; // Add the withdrawn amount to the user's balance
        
        emit CampaignWithdrawal(campaignId, campaign.owner, userId, amount, campaign.milestone, Date.getCurrentTimestamp());
        console.log("END: withDrawFromCampaign for campaign %s finished.", campaignId);
    }

    function donate(address donorUserId, address campaignId, int256 amount) public {
        require(userExists[donorUserId], "Donor user does not exist");
        require(campaignExists[campaignId], "Campaign does not exist");
        require(amount > 0, "Amount must be greater than 0");
        
        User storage donorUser = users[donorUserId];
        Campaign storage campaign = campaigns[campaignId];

        console.log("User %s balance before donation: %s", donorUserId, int2str(donorUser.balance));
        require(donorUser.balance > amount, "Insufficient balance for donation");
        require(!campaign.finished, "Campaign already finished");

        // console.log(donorUser.balance);
        // console.log(amount);

        console.log("Processing donation for campaign %s from user %s...", campaignId, donorUserId);
        donorUser.balance -= amount;

        console.log("User %s balance after donation: %s", donorUserId, int2str(donorUser.balance));
        console.log("Amount to be added to campaign %s: %s", campaignId, int2str(amount));
        int256 oldMilestone = campaign.milestone;
        
        updateCampaignMilestone(campaignId, amount); // This updates campaign.milestone and handles finish
        
        int256 progressPercentage = 0;
        if (campaign.target > 0) {
            progressPercentage = (campaign.milestone * 10000) / campaign.target;
        }
        
        emit DonationMade(campaignId, donorUserId, msg.sender, amount, campaign.milestone, progressPercentage, Date.getCurrentTimestamp());
        emit UserBalanceUpdated(donorUserId, msg.sender, donorUser.balance, amount, "donation_made", Date.getCurrentTimestamp());
        
        if (campaign.milestone != oldMilestone && !campaign.finished) {
            emit MilestoneReached(campaignId, campaign.owner, campaign.milestone, campaign.target, campaign.finished, Date.getCurrentTimestamp());
        }
        console.log("END: donate for campaign %s by user %s finished.", campaignId, donorUserId);
    }

    function updateCampaignMilestone(address campaignId, int256 amountToIncrease) internal {
        Campaign storage campaign = campaigns[campaignId];
        campaign.milestone += amountToIncrease;

        if(campaign.milestone >= campaign.target && !campaign.finished) {
            console.log("Target reached for campaign %s! Finishing campaign...", campaignId);
            campaign.finished = true;
            
            emit CampaignFinished(campaignId, campaign.owner, "target_reached", campaign.milestone, Date.getCurrentTimestamp());
            emit MilestoneReached(campaignId, campaign.owner, campaign.milestone, campaign.target, campaign.finished, Date.getCurrentTimestamp());
            console.log("Campaign %s marked as finished due to target reached.", campaignId);
        }
        console.log("INTERNAL END: updateCampaignMilestone for campaign %s.", campaignId);
    }

    function getUser(address userId) public view returns (User memory) {
        console.log("START: getUser called. UserID: %s", userId);
        require(userExists[userId], "User does not exist");
        console.log("END: getUser for %s. Returning user data.", userId);
        return users[userId];
    }
    
    // function getUserCampaignStats(address userId) public view returns (uint total, uint active, uint finishedCount) {
    //     console.log("START: getUserCampaignStats called. UserID: %s", userId);
    //     require(userExists[userId], "User does not exist");
        
    //     address[] memory userCampaignIds = users[userId].campaigns;
    //     total = userCampaignIds.length;
    //     console.log("User %s has %d campaigns in their list.", userId, total);
        
    //     for (uint i = 0; i < userCampaignIds.length; i++) {
    //         address currentCampaignId = userCampaignIds[i];
    //         if (campaignExists[currentCampaignId]) {
    //              if (campaigns[currentCampaignId].finished) {
    //                 finishedCount++;
    //             } else {
    //                 active++;
    //             }
    //         } else {
    //             console.log("Warning: Campaign ID %s found in user %s's list but does not exist in global campaigns mapping.", currentCampaignId, userId);
    //         }
    //     }
    //     return (total, active, finishedCount);
    // }
    
    struct CampaignInput {
        address campaignId;
        address ownerUserId;
        string title;
        uint durationSeconds;
        int256 targetAmount;
        int256 initialMilestone;
    }

    function createManyCampaigns(CampaignInput[] memory campaignInputs) public {
        console.log("START: createManyCampaigns called. Number of campaigns to create: %d", campaignInputs.length);
        require(campaignInputs.length > 0, "Campaign inputs array cannot be empty");
        
        for (uint i = 0; i < campaignInputs.length; i++) {
            CampaignInput memory input = campaignInputs[i];
            console.log("Processing campaign at index %d: ID %s, Title: %s", i, input.campaignId, input.title);
            
            // Validate each campaign input before creating
            require(userExists[input.ownerUserId], string(abi.encodePacked("Owner user does not exist for campaign ", address2str(input.campaignId))));
            require(input.campaignId != address(0), "Campaign ID cannot be zero address");
            require(!campaignExists[input.campaignId], string(abi.encodePacked("Campaign ID already exists: ", address2str(input.campaignId))));
            require(input.durationSeconds > 0, string(abi.encodePacked("Duration must be greater than 0 for campaign ", address2str(input.campaignId))));
            require(input.targetAmount > 0, string(abi.encodePacked("Target amount must be greater than 0 for campaign ", address2str(input.campaignId))));
            require(bytes(input.title).length > 0, string(abi.encodePacked("Title cannot be empty for campaign ", address2str(input.campaignId))));
        
            // Create the campaign
            console.log("Creating campaign with ID %s for owner %s...", input.campaignId, input.ownerUserId);
            uint campaignStartTime = Date.getCurrentTimestamp();
            
            campaigns[input.campaignId] = Campaign({
                owner: input.ownerUserId,
                title: input.title,
                duration: input.durationSeconds,
                startTime: campaignStartTime,
                target: input.targetAmount,
                milestone: input.initialMilestone,
                finished: false
            });

            updateCampaignMilestone(input.campaignId, 0);
            
            campaignExists[input.campaignId] = true;
            allCampaignIds.push(input.campaignId);
            users[input.ownerUserId].campaigns.push(input.campaignId);
            
            emit CampaignCreated(input.campaignId, input.ownerUserId, input.title, input.targetAmount, input.durationSeconds, campaignStartTime);
            console.log("Campaign %s created successfully at index %d", input.campaignId, i);
        }
        
        console.log("END: createManyCampaigns finished. Total campaigns created: %d", campaignInputs.length);
    }

    function createCampaign(address campaignId, address ownerUserId, string memory title, uint durationSeconds, int256 targetAmount, int256 initialMilestone) public {
        require(userExists[ownerUserId], "Owner user does not exist");
        require(campaignId != address(0), "Campaign ID cannot be zero address");
        require(!campaignExists[campaignId], "Campaign ID already exists");
        require(durationSeconds > 0, "Duration must be greater than 0 seconds");
        require(targetAmount > 0, "Target amount must be greater than 0");
        require(bytes(title).length > 0, "Title cannot be empty");
        
        console.log("Creating new campaign with ID %s for owner %s...", campaignId, ownerUserId);
        uint campaignStartTime = Date.getCurrentTimestamp();
        campaigns[campaignId] = Campaign({
            owner: ownerUserId,
            title: title,
            duration: durationSeconds,
            startTime: campaignStartTime,
            target: targetAmount,
            milestone: initialMilestone,
            finished: false
        });
        
        campaignExists[campaignId] = true;
        allCampaignIds.push(campaignId);
        users[ownerUserId].campaigns.push(campaignId);
        
        emit CampaignCreated(campaignId, ownerUserId, title, targetAmount, durationSeconds, campaignStartTime);
        console.log("END: createCampaign for campaign %s finished.", campaignId);
    }
    
    // function finishCampaignManually(address campaignId) public {
    //     console.log("START: finishCampaignManually called. CampaignID: %s, Caller: %s", campaignId, msg.sender);
    //     require(campaignExists[campaignId], "Campaign does not exist");
    //     Campaign storage campaign = campaigns[campaignId];

    //     require(!campaign.finished, "Campaign already finished");
        
    //     campaign.finished = true;
    //     console.log("Campaign %s marked as finished manually by owner %s.", campaignId, msg.sender);
        
    //     string memory reason = "manual_finish";
    //     if (isCampaignExpired(campaignId)) {
    //         reason = "manual_finish_expired";
    //         console.log("Campaign %s was also expired at time of manual finish.", campaignId);
    //     }
        
    //     emit CampaignFinished(campaignId, campaign.owner, reason, campaign.milestone, Date.getCurrentTimestamp());
    //     console.log("END: finishCampaignManually for campaign %s finished.", campaignId);
    // }
    
    // function isCampaignExpired(address campaignId) public view returns (bool) {
    //     require(campaignExists[campaignId], "Campaign does not exist");
        
    //     Campaign memory campaign = campaigns[campaignId];
    //     bool expired = (Date.getCurrentTimestamp() >= (campaign.startTime + campaign.duration));
    //     return expired;
    // }

    function getAllCampaignsGlobal() public view returns (CampaignWithId[] memory) {
        console.log("START: getAllCampaignsGlobal called. Total unique campaign IDs tracked: %d", allCampaignIds.length);
        CampaignWithId[] memory allCampaignsArray = new CampaignWithId[](allCampaignIds.length);
        
        for (uint i = 0; i < allCampaignIds.length; i++) {
            address currentCampaignId = allCampaignIds[i];
            Campaign memory campaign = campaigns[currentCampaignId];
            
            allCampaignsArray[i] = CampaignWithId({
                id: currentCampaignId,
                owner: campaign.owner,
                title: campaign.title,
                duration: campaign.duration,
                startTime: campaign.startTime,
                target: campaign.target,
                milestone: campaign.milestone,
                finished: campaign.finished
            });
        }
        
        console.log("END: getAllCampaignsGlobal. Returning %d campaigns.", allCampaignsArray.length);
        return allCampaignsArray;
    }
    
    function getCampaign(address campaignId) public view returns (Campaign memory) {
        console.log("START: getCampaign called. CampaignID: %s", campaignId);
        require(campaignExists[campaignId], "Campaign does not exist");
        console.log("END: getCampaign for %s. Returning campaign data.", campaignId);
        return campaigns[campaignId];
    }
    
    // function getCampaignProgress(address campaignId) public view returns (int256 percentage) { // Returns e.g. 5025 for 50.25%
    //     console.log("START: getCampaignProgress called. CampaignID: %s", campaignId);
    //     require(campaignExists[campaignId], "Campaign does not exist");
    //     Campaign memory campaign = campaigns[campaignId];
        
    //     if (campaign.target == 0) {
    //         console.log("Campaign %s target is 0, returning 0% progress.", campaignId);
    //         return 0;
    //     }
        
    //     percentage = (campaign.milestone * 10000) / campaign.target;
    //     if (percentage > 10000) {
    //          percentage = 10000; // Cap at 100.00%
    //     }
    //     return percentage;
    // }
}
