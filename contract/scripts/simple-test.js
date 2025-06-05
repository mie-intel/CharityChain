// Simple test script
console.log("🚀 Script started");

async function main() {
  console.log("📝 Inside main function");

  try {
    console.log("🔍 Testing ethers...");
    const { ethers } = require("hardhat");
    console.log("✅ Ethers loaded");

    console.log("🏗️ Getting contract factory...");
    const Main = await ethers.getContractFactory("Main");
    console.log("✅ Contract factory loaded");

    console.log("📊 Getting bytecode size...");
    const bytecode = Main.bytecode;
    console.log("📏 Bytecode length:", bytecode.length);

    console.log("🎉 Test completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

console.log("🚀 Calling main function...");
main().catch((error) => {
  console.error("❌ Main function failed:", error);
  process.exit(1);
});

console.log("🚀 Script end");
