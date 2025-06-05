"use client";

import { ethers } from "ethers";
import { contractABI, contractAddress } from "@/contracts/config";

// Sepolia network configuration
const SEPOLIA_NETWORK = {
  chainId: "0xaa36a7", // 11155111 in hex
  chainName: "Sepolia test network",
  nativeCurrency: {
    name: "SepoliaETH",
    symbol: "SepoliaETH",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia.infura.io/v3/", "https://eth-sepolia.g.alchemy.com/v2/"],
  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
};

export const useContract = async () => {
  // Check if MetaMask is installed
  if (!window.ethereum) {
    throw new Error("Please install MetaMask to use this dApp");
  }

  // Request account access
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  // console.log("Connected accounts:", accounts);

  // Check current network
  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  // console.log("Current chain ID:", currentChainId);
  // console.log("Expected Sepolia chain ID:", SEPOLIA_NETWORK.chainId);

  // Switch to Sepolia if not already connected
  if (currentChainId !== SEPOLIA_NETWORK.chainId) {
    try {
      // console.log("Switching to Sepolia network...");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_NETWORK.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          // console.log("Adding Sepolia network to MetaMask...");
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [SEPOLIA_NETWORK],
          });
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError);
          throw new Error("Failed to add Sepolia network to MetaMask");
        }
      } else {
        console.error("Failed to switch to Sepolia network:", switchError);
        throw new Error("Please switch to Sepolia testnet in MetaMask");
      }
    }
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  // console.log("Provider initialized:", provider);

  const signer = await provider.getSigner();
  // console.log("Signer obtained:", signer);

  // Get user address
  const userAddress = await signer.getAddress();
  // console.log("User address:", userAddress);

  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  // console.log("Contract initialized:", contract);

  // console.log("useContract - Contract:", contract);
  // console.log("useContract - Account:", accounts);
  // console.log("useContract - Network: Sepolia Testnet");

  return {
    contract,
    account: accounts,
    signer,
    userAddress,
    provider,
    network: "sepolia",
  };
};
