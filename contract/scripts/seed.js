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
    console.log("Contract initialized:", contract);
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
};
module.exports = {
  seedData,
};
