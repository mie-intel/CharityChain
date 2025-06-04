const { saveContractInfo, saveFrontendFiles } = require("./utils.js");
const { seedData } = require("./seed.js");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy contract
  const Main = await ethers.getContractFactory("Main");
  const main = await Main.deploy();

  console.log("Main contract deployed to:", await main.getAddress());

  // Get network info
  const network = hre.network.name;

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

  await seedData(main);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
