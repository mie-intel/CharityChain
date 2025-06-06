const { saveContractInfo, saveFrontendFiles } = require("./utils.js");
const { seedData } = require("./seed.js");

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);
  console.log("=== GAS ESTIMATION REPORT ===");
  console.log("Deploying contracts with account:", deployerAddress);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Get current gas price (ethers v6 compatible)
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  console.log(
    "Current gas price:",
    ethers.formatUnits(gasPrice, "gwei"),
    "Gwei"
  );

  // Estimate deployment gas
  const Main = await ethers.getContractFactory("Main");

  console.log("\n=== DEPLOYMENT GAS ESTIMATION ===");

  try {
    // Estimate gas for deployment
    const deployTx = await Main.getDeployTransaction();
    const estimatedGas = await ethers.provider.estimateGas(deployTx);
    const estimatedCost = estimatedGas * gasPrice;

    console.log("Estimated gas for deployment:", estimatedGas.toString());
    console.log("Estimated cost:", ethers.formatEther(estimatedCost), "ETH");
    console.log(
      "Estimated cost (USD at $2000/ETH):",
      (parseFloat(ethers.formatEther(estimatedCost)) * 2000).toFixed(4),
      "USD"
    );

    // Check if deployer has enough balance
    if (balance < estimatedCost) {
      console.error("❌ INSUFFICIENT BALANCE!");
      console.error("Required:", ethers.formatEther(estimatedCost), "ETH");
      console.error("Available:", ethers.formatEther(balance), "ETH");
      process.exit(1);
    }

    console.log("✅ Sufficient balance for deployment");
  } catch (error) {
    console.error("Error estimating gas:", error.message);
  }

  console.log("\n=== DEPLOYING CONTRACT ===");

  // Deploy contract
  const main = await Main.deploy();
  await main.waitForDeployment();

  console.log("Main contract deployed to:", await main.getAddress());
  // Get actual deployment transaction
  const deploymentTx = main.deploymentTransaction();
  if (deploymentTx) {
    console.log("Actual gas used:", deploymentTx.gasLimit?.toString() || "N/A");
    console.log(
      "Actual gas price:",
      ethers.formatUnits(deploymentTx.gasPrice || gasPrice, "gwei"),
      "Gwei"
    );
    console.log("Transaction hash:", deploymentTx.hash);
  }

  // Get network info
  const network = hre.network.name;
  console.log("Network:", network);

  // Save contract info
  saveContractInfo(
    "Main",
    network,
    await main.getAddress(),
    Main.interface.formatJson()
  );

  // For frontend integration
  saveFrontendFiles({
    address: await main.getAddress(),
    abi: Main.interface.formatJson(),
  });

  console.log("\n=== SEEDING DATA ===");
  await seedData(main);

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log("Contract Address:", await main.getAddress());
  console.log("Network:", network);
  console.log(
    "Explorer URL (Sepolia):",
    `https://sepolia.etherscan.io/address/${await main.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
