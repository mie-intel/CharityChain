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

  // Check current network
  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
  });

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

  const signer = await provider.getSigner();

  // Get user address
  const userAddress = await signer.getAddress();

  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  return {
    contract,
    account: accounts,
    signer,
    userAddress,
    provider,
    network: "sepolia",
  };
};
