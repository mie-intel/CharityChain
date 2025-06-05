require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Optimize for deployment cost
      },
      viaIR: true, // Enable IR compilation for better size optimization
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      // Optional: Increase block gas limit for local testing
      gas: 30_000_000,
      blockGasLimit: 30_000_000,
    },
    // 🌐 Sepolia Testnet Configuration
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: 20000000000, // 20 gwei
      gas: 6000000, // 6M gas limit
      timeout: 60000, // 60 seconds timeout
    },
    // Uncomment when ready to deploy to Monad
    // monadTestnet: {
    //   url: "https://devnet.monad.xyz",
    //   chainId: 19752202208008,
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    //   gasPrice: 1000000000, // 1 gwei (adjust as needed)
    //   gas: 15_000_000 // Monad may support higher limits
    // },
  },
  // 🔍 Etherscan Configuration for Contract Verification
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  mocha: {
    timeout: 100000, // For longer test runs
  },
};
