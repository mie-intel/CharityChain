const fs = require("fs");
const path = require("path");

const saveContractInfo = (contractName, network, address, abi) => {
  const contractsDir = path.join(__dirname, "..", "contract-info");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Save address
  fs.writeFileSync(
    path.join(contractsDir, `${contractName}-${network}-address.json`),
    JSON.stringify({ address }, undefined, 2)
  );

  // Save ABI
  fs.writeFileSync(
    path.join(contractsDir, `${contractName}-abi.json`),
    JSON.stringify(abi, null, 2)
  );

  console.log(`Contract info saved for ${contractName} on ${network}`);
};

// Optional: For frontend integration
function saveFrontendFiles({ address, abi }) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../fe/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  console.log("Saving contract address and ABI for frontend...");
  console.log("Contract address:", address);

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Main: address }, undefined, 2)
  );

  // const MainArtifact = artifacts.readArtifactSync("Main");
  fs.writeFileSync(
    contractsDir + "/abi.json",
    JSON.stringify({ abi: abi }, null, 2)
  );
}

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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
