const { createClient } = require("@supabase/supabase-js");
const { getAddressFromUserId } = require("./utils.js"); // Adjust the import based on your project structure
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY; // Or service_role key if needed for writes/reads

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const seedData = async (contract) => {
  // Seed user
  try {
    const userData = await supabase.from("Users").select("*");
    // console.log("Contract initialized:", contract);
    const userIdList = userData.data.map((user) =>
      getAddressFromUserId(user.uid)
    );
    const transaction = await contract.createManyUsers(userIdList, 0);
    console.log("Users created in contract:", userIdList);
    await transaction.wait();
    console.log("Transaction hash:", transaction.hash);
    console.log("Seed successfully in the contract");
  } catch (error) {
    console.error("Error seeding data:", error);
  }

  // Seed campaigns
  try {
    console.log("Starting batch campaign seeding...");

    const campaignData = await supabase.from("Campaigns").select("*");

    if (campaignData.data && campaignData.data.length > 0) {
      // Prepare campaign inputs untuk struct version
      const campaignInputs = campaignData.data.map((campaign) => ({
        campaignId: campaign.campaignid,
        ownerUserId: campaign.organizer,
        title: campaign.title,
        durationSeconds: campaign.duration * 24 * 60 * 60,
        targetAmount: campaign.target,
        initialMilestone: campaign.current || 0,
      }));

      console.log("Campaign inputs prepared:", campaignInputs);

      // Call batch create function
      const batchTransaction =
        await contract.createManyCampaigns(campaignInputs);
      const campaignIds = campaignInputs.map((input) => input.campaignId);
      console.log("Batch campaign transaction sent:", campaignIds);
      await batchTransaction.wait();
      console.log("All campaigns created successfully in batch!");
    } else {
      console.log("No campaigns found to seed");
    }
  } catch (error) {
    console.error("Error batch seeding campaigns:", error);
  }
};
module.exports = {
  seedData,
};
