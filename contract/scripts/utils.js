const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

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

function getAddressFromUserId(userId) {
  // console.log("ethers object:", ethers);
  // console.log("ethers.utils object:", ethers.utils);
  const hash = ethers.keccak256(ethers.toUtf8Bytes(userId));
  const privateKey = hash.substring(0, 66); // Ambil 32 byte pertama sebagai private key
  const wallet = new ethers.Wallet(privateKey);
  return wallet.address;
}

module.exports = {
  saveContractInfo,
  saveFrontendFiles,
  getAddressFromUserId,
};
