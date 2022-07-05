const hre = require("hardhat");

async function main() {

  const deployer= await ethers.getSigner();
  console.log("deployer address ", deployer.address);
  console.log("deployer balance ", (await deployer.getBalance())/1e18);

  //  1. Marketplace
  const Markeplace = await ethers.getContractFactory("ClubVirtualERC721TEST");
  const markeplace = await Markeplace.deploy();

  await markeplace.deployed();

  console.log("marketplace Contract deployed to:", markeplace.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  // 2. Normal ERC721
  // const NormalNFT = await ethers.getContractFactory("ClubVirtualERC721");
  // const normalNFT = await NormalNFT.deploy(markeplace.address);

  // await normalNFT.deployed();

  // console.log("NormalNFT Contract deployed to:", normalNFT.address);

  //  3. Lazymint ERC721
  // const LazyNFT = await ethers.getContractFactory("ClubVirtualLazyERC721");
  // const lazyNFT = await LazyNFT.deploy(deployer.address, markeplace.address);

  // await lazyNFT.deployed();

  // console.log("LazyNFT Token Contract deployed to:", lazyNFT.address);
  // console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  //  4. ERC1155 
  // const ClubVirtual1155 = await ethers.getContractFactory("ClubVirtualERC1155");
  // const clubVirtual1155 = await ClubVirtual1155.deploy(markeplace.address);

  // await clubVirtual1155.deployed();

  // console.log("ERC1155 Contract deployed to:", clubVirtual1155.address);
  // console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  // Initialize() Marketplace

  // const RoyaltyStorage = await ethers.getContractFactory("RoyaltyStorage");
  // const royaltyStorage = await RoyaltyStorage.deploy(normalNFT.address, markeplace.address);

  // await royaltyStorage.deployed();

  // console.log("Royalty Storage Contract deployed to:", royaltyStorage.address);


  // INITIALIZE
  // 1. NFT Set Marketplace
  // const setMarketplace= normalNFT.setMarketplace(markeplace.address);
  // console.log("marketplace set in normal NFT: ", setMarketplace.hash)

  // // 2. Set normal NFT and Royalty storage in marketplace
  // const setInitData= markeplace.setInitData(normalNFT.address, normalNFT.address, royaltyStorage.address)
  // console.log(setInitData.hash)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
