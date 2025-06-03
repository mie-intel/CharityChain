import { ethers } from "ethers";

export function getAddressFromUserId(userId) {
  console.log("ethers object:", ethers);
  console.log("ethers.utils object:", ethers.utils);
  const hash = ethers.keccak256(ethers.toUtf8Bytes(userId));
  const privateKey = hash.substring(0, 66); // Ambil 32 byte pertama sebagai private key
  const wallet = new ethers.Wallet(privateKey);
  return wallet.address;
}
