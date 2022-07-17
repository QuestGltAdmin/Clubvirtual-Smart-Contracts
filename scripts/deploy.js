async function main() {
  const deployer= await ethers.getSigner();
  console.log("deployer address ", deployer.address);
  console.log("deployer balance ", (await deployer.getBalance())/1e18);

  // 4. ERC1155 Sale
  const ClubVirtual1155Sale = await ethers.getContractFactory("ClubVirtualERC1155Sale");
  const clubVirtual1155Sale = await ClubVirtual1155Sale.deploy();

  await clubVirtual1155Sale.deployed();

  console.log("ERC1155 Sale:", clubVirtual1155Sale.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  //  5. ERC1155 
  const ClubVirtual1155 = await ethers.getContractFactory("ClubVirtualERC1155");
  const clubVirtual1155 = await ClubVirtual1155.deploy(clubVirtual1155Sale.address);

  await clubVirtual1155.deployed();

  console.log("ERC1155 Token: ", clubVirtual1155.address);

  const RoyaltyStorage = await ethers.getContractFactory("DataStorage");
  const royaltyStorage = await RoyaltyStorage.deploy(clubVirtual1155Sale.address,clubVirtual1155Sale.address);

  await royaltyStorage.deployed();

  console.log("Data Storage:", royaltyStorage.address);

  const setInitData_ =  await clubVirtual1155Sale.setInitData(clubVirtual1155.address, royaltyStorage.address)
  console.log("ERC1155 Sale initialized ",setInitData_.hash);

  const setFees= await royaltyStorage.editFees(deployer.address, [[1000,"0x480F3767c52205C6b2661170D04268310EF4be82"],[1000, "0x63ae014825af4Ea0f89e4349bDFecCF26030D245"],[1000, "0xF1BB00215BB6eDa4e89DDd5879fBEbc797A67746"]], 1000, 1000);
  console.log("fees set", setFees.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
