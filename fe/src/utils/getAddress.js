import { ethers } from "ethers";

export function getAddressFromUserId(userId) {
  console.log("ethers object:", ethers);
  const hash = ethers.keccak256(ethers.toUtf8Bytes(userId.toString()));
  const privateKey = hash.substring(0, 66); // Ambil 32 byte pertamac sebagai private key
  const wallet = new ethers.Wallet(privateKey);
  return wallet.address;
}

export function getRandomId() {
  // Buat buffer 8 byte (64 bit)
  const buffer = new Uint8Array(8);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(buffer);
  } else {
    console.log(
      "Peringatan: crypto.getRandomValues tidak tersedia. Menggunakan Math.random() sebagai fallback (kurang aman).",
    );
    for (let i = 0; i < 8; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
  }

  const dataView = new DataView(buffer.buffer);
  const randomBigInt = dataView.getBigInt64(0, false /* big-endian */);

  return randomBigInt;
}
