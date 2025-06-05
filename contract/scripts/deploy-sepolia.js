const { saveContractInfo, saveFrontendFiles } = require("./utils.js");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "🚀 Deploying contracts to Sepolia with account:",
    deployer.address
  );

  // Check account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("📊 Account balance:", ethers.formatEther(balance), "ETH");

  if (balance < ethers.parseEther("0.1")) {
    console.warn(
      "⚠️  Warning: Low balance! You need at least 0.1 ETH for deployment"
    );
  }
  console.log("🔨 Compiling contracts...");

  // Deploy contract
  const Main = await ethers.getContractFactory("Main");

  // 🔍 ESTIMATE GAS SEBELUM DEPLOY
  console.log("⛽ Estimating deployment gas...");
  const deploymentData = Main.getDeployTransaction();
  const gasEstimate = await ethers.provider.estimateGas({
    data: deploymentData.data,
  });

  const feeData = await ethers.provider.getFeeData();
  const estimatedCostWei = gasEstimate * feeData.gasPrice;
  const estimatedCostEth = ethers.formatEther(estimatedCostWei);

  console.log("📊 Estimated gas:", gasEstimate.toString());
  console.log(
    "💰 Gas price:",
    ethers.formatUnits(feeData.gasPrice, "gwei"),
    "gwei"
  );
  console.log("💵 Estimated cost:", estimatedCostEth, "ETH");

  console.log("📤 Deploying Main contract...");
  const main = await Main.deploy();

  console.log("⏳ Waiting for deployment transaction...");
  await main.waitForDeployment();

  const contractAddress = await main.getAddress();
  console.log("✅ Main contract deployed to:", contractAddress);

  // Get network info
  const network = hre.network.name;
  console.log("🌐 Network:", network);

  // Get deployment transaction details
  const deployTx = main.deploymentTransaction();
  if (deployTx) {
    console.log("📋 Transaction hash:", deployTx.hash);
    console.log("💰 Gas used:", deployTx.gasLimit.toString());
    console.log(
      "💵 Gas price:",
      ethers.formatUnits(deployTx.gasPrice, "gwei"),
      "gwei"
    );
  }

  // Save contract info
  console.log("💾 Saving contract information...");
  saveContractInfo(
    "Main",
    network,
    contractAddress,
    Main.interface.formatJson()
  );

  // For frontend integration
  saveFrontendFiles({
    address: contractAddress,
    abi: Main.interface.formatJson(),
  });

  console.log("🎉 Deployment completed successfully!");
  console.log("📝 Contract address:", contractAddress);
  console.log(
    "🔍 Verify on Etherscan:",
    `https://sepolia.etherscan.io/address/${contractAddress}`
  );
  console.log(
    "⚡ Run verification with: npm run verify:sepolia",
    contractAddress
  );

  // Note: No seeding for testnet deployment
  console.log("ℹ️  Note: Seeding skipped for Sepolia deployment");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
