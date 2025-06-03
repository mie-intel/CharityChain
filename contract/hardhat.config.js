require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // monadTestnet: {
    //   url: "https://devnet.monad.xyz", // RPC URL Monad Testnet
    //   chainId: 19752202208008, // Chain ID Monad Testnet (Devnet)
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // Kunci privat akun Anda
    // },
  },
};
