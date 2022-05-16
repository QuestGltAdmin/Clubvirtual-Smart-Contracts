const hre = require("hardhat");

async function main() {

  const deployer= await ethers.getSigner();
  console.log("deployer address ", deployer.address);
  console.log("deployer balance ", (await deployer.getBalance())/1e18);

   //  1. Marketplace
  const Markeplace = await ethers.getContractFactory("NFTAuction");
  const markeplace = await Markeplace.deploy();

  await markeplace.deployed();

  console.log("marketplace Contract deployed to:", markeplace.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  // 2. Normal ERC721
  const NormalNFT = await ethers.getContractFactory("ClubVirtualNormal");
  const normalNFT = await NormalNFT.deploy(markeplace.address);

  await normalNFT.deployed();

  console.log("NormalNFT Contract deployed to:", normalNFT.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  //  3. Lazymint ERC721
  const LazyNFT = await ethers.getContractFactory("ClubVirtualLazyNFT");
  const lazyNFT = await LazyNFT.deploy(deployer.address, markeplace.address, 100);

  await lazyNFT.deployed();

  console.log("LazyNFT Token Contract deployed to:", lazyNFT.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  //  4. ERC1155 
  const ClubVirtual1155 = await ethers.getContractFactory("ClubVirtual1155");
  const clubVirtual1155 = await ClubVirtual1155.deploy(markeplace.address);

  await clubVirtual1155.deployed();

  console.log("ERC1155 Contract deployed to:", clubVirtual1155.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  // Initialize() Marketplace
  const initialize= markeplace.initialize(normalNFT.address, lazyNFT.address, clubVirtual1155.address)
  console.log("contract initilize()", initialize);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
