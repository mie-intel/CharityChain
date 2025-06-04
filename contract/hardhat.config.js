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
    // Uncomment when ready to deploy to Monad
    // monadTestnet: {
    //   url: "https://devnet.monad.xyz",
    //   chainId: 19752202208008,
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    //   gasPrice: 1000000000, // 1 gwei (adjust as needed)
    //   gas: 15_000_000 // Monad may support higher limits
    // },
  },
  mocha: {
    timeout: 100000, // For longer test runs
  },
};
