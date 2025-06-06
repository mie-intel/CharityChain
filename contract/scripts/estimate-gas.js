const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Estimating gas for Main contract deployment...");

  // Get the contract factory
  const Main = await ethers.getContractFactory("Main");

  // Get deployment data
  const deploymentData = Main.getDeployTransaction();
  console.log(
    "📊 Deployment bytecode size:",
    deploymentData.data.length / 2 - 1,
    "bytes"
  );

  // Estimate gas for deployment
  const gasEstimate = await ethers.provider.estimateGas({
    data: deploymentData.data,
  });

  console.log("⛽ Estimated gas for deployment:", gasEstimate.toString());

  // Get current gas price
  const feeData = await ethers.provider.getFeeData();
  console.log(
    "💰 Current gas price:",
    ethers.formatUnits(feeData.gasPrice, "gwei"),
    "gwei"
  );
  console.log(
    "🚀 Max fee per gas:",
    ethers.formatUnits(feeData.maxFeePerGas, "gwei"),
    "gwei"
  );
  console.log(
    "💨 Max priority fee:",
    ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei"),
    "gwei"
  );

  // Calculate estimated cost
  const estimatedCostWei = gasEstimate * feeData.gasPrice;
  const estimatedCostEth = ethers.formatEther(estimatedCostWei);

  console.log("💵 Estimated deployment cost:", estimatedCostEth, "ETH");

  // Check deployer balance if available
  try {
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    const balanceEth = ethers.formatEther(balance);

    console.log("👛 Deployer address:", deployer.address);
    console.log("💰 Current balance:", balanceEth, "ETH");

    if (balance > estimatedCostWei) {
      console.log("✅ Sufficient balance for deployment");
      const remaining = ethers.formatEther(balance - estimatedCostWei);
      console.log("💰 Remaining after deployment:", remaining, "ETH");
    } else {
      console.log("❌ Insufficient balance for deployment");
      const needed = ethers.formatEther(estimatedCostWei - balance);
      console.log("💸 Additional ETH needed:", needed, "ETH");
    }
  } catch (error) {
    console.log("ℹ️  Could not check deployer balance:", error.message);
  }

  // Contract size analysis
  const bytecodeSize = deploymentData.data.length / 2 - 1;
  const maxContractSize = 24576; // 24KB limit

  console.log("\n📏 Contract Size Analysis:");
  console.log("📊 Bytecode size:", bytecodeSize, "bytes");
  console.log("📊 Max allowed size:", maxContractSize, "bytes");
  console.log(
    "📊 Size usage:",
    ((bytecodeSize / maxContractSize) * 100).toFixed(2) + "%"
  );

  if (bytecodeSize > maxContractSize) {
    console.log("❌ Contract size exceeds limit!");
  } else {
    console.log("✅ Contract size within limits");
  }
}

main().catch((error) => {
  console.error("❌ Gas estimation failed:", error);
  process.exit(1);
});
