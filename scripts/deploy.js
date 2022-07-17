async function main() {
  const RoyaltyStorage = await ethers.getContractFactory("DataStorage");
  const royaltyStorage = await RoyaltyStorage.deploy();

  await royaltyStorage.deployed();

  console.log("Data Storage:", royaltyStorage.address);

  const setFees= await royaltyStorage.editFees(royaltyStorage.address, [[100 , royaltyStorage.address],[100 , royaltyStorage.address],[100 , royaltyStorage.address]], 1000, 1000);
  console.log("fees set", setFees.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
