import address from "./contract-address.json";
import abi from "./abi.json";

// Use Sepolia contract address for testnet
export const contractAddress = address.MainSepolia || address.Main;

export const contractABI = abi.abi;

// Network configuration
export const NETWORK_CONFIG = {
  sepolia: {
    chainId: "0xaa36a7", // 11155111 in hex
    chainName: "Sepolia test network",
    nativeCurrency: {
      name: "SepoliaETH",
      symbol: "SepoliaETH",
      decimals: 18,
    },
    rpcUrls: ["https://sepolia.infura.io/v3/", "https://eth-sepolia.g.alchemy.com/v2/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
  },
};
