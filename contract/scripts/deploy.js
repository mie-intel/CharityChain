async function main() {
  const Main = await ethers.getContractFactory("Main");
  const main = await Main.deploy(); // Ini sudah mengembalikan instance yang siap digunakan

  console.log("Main contract deployed to:", await main.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
