// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  const deployer= await ethers.getSigner();
  console.log("deployer address ", deployer.address);
  console.log("deployer balance ", (await deployer.getBalance())/1e18);

   //  1. PlayerNFT (ERC721)
  const Markeplace = await ethers.getContractFactory("NFTAuction");
  const markeplace = await Markeplace.deploy();

  await markeplace.deployed();

  console.log("marketplace Contract deployed to:", markeplace.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  // 2. CoachNFT
  const NormalNFT = await ethers.getContractFactory("ClubVirtualNormal");
  const normalNFT = await NormalNFT.deploy(markeplace.address);

  await normalNFT.deployed();

  console.log("NormalNFT Contract deployed to:", normalNFT.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  

  //  3. MetaCricket ERC20
  const LazyNFT = await ethers.getContractFactory("ClubVirtualLazyNFT");
  const lazyNFT = await LazyNFT.deploy(deployer.address, markeplace.address, 100, deployer.address);

  await lazyNFT.deployed();

  console.log("LazyNFT Token Contract deployed to:", lazyNFT.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);


  //  4. Marketplace Contract: Auction & Buy/Sell
  const ClubVirtual1155 = await ethers.getContractFactory("ClubVirtual1155");
  const clubVirtual1155 = await ClubVirtual1155.deploy(markeplace.address);

  await clubVirtual1155.deployed();

  console.log("ERC1155 Contract deployed to:", clubVirtual1155.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);


  const initialize= markeplace.initialize(normalNFT.address, lazyNFT.address, clubVirtual1155.address, 1000); // 1000= 10%
  console.log("contract initilize()", initialize);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
