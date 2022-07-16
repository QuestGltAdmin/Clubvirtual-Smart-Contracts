const hre = require("hardhat");

async function main() {

  const deployer= await ethers.getSigner();
  console.log("deployer address ", deployer.address);
  console.log("deployer balance ", (await deployer.getBalance())/1e18);

  //  1. Marketplace
  const Markeplace = await ethers.getContractFactory("ClubVirtualMarketplaceERC721");
  const markeplace = await Markeplace.deploy();

  await markeplace.deployed();

  console.log("Marketplace ERC721:", markeplace.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  // 2. Normal ERC721
  const NormalNFT = await ethers.getContractFactory("ClubVirtualERC721");
  const normalNFT = await NormalNFT.deploy(markeplace.address);

  await normalNFT.deployed();

  console.log("NormalNFT Token:", normalNFT.address);

  //  3. Lazymint ERC721
  const LazyNFT = await ethers.getContractFactory("ClubVirtualLazyERC721");
  const lazyNFT = await LazyNFT.deploy(deployer.address, markeplace.address);

  await lazyNFT.deployed();

  console.log("LazyNFT Token:", lazyNFT.address);
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

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
  console.log("Remaining balance ", (await deployer.getBalance())/1e18);

  // Initialize() Marketplace

  const RoyaltyStorage = await ethers.getContractFactory("DataStorage");
  const royaltyStorage = await RoyaltyStorage.deploy(clubVirtual1155Sale.address, markeplace.address);

  await royaltyStorage.deployed();

  console.log("Data Storage:", royaltyStorage.address);

  // INITIALIZE
  // 1. NFT Set Marketplace
  const setMarketplace= await normalNFT.setMarketplace(markeplace.address);
  console.log("marketplace set in normal NFT: ", setMarketplace.hash)

  // 2. Set normal NFT token and Data storage in marketplace
  const setInitData= await markeplace.setInitData(normalNFT.address, lazyNFT.address, royaltyStorage.address)
  console.log("ERC721 Marketplace initialized ",setInitData.hash)

  // 3. Set erc1155 token NFT and Data storage in marketplace
  const setInitData_ =  await clubVirtual1155Sale.setInitData(clubVirtual1155.address, royaltyStorage.address)
  console.log("ERC1155 Sale initialized ",setInitData_.hash);

  // 4. Set fees in DataStorage
  const setFees= await royaltyStorage.editFees(deployer.address, 1000, 1000, 1000);
  console.log("fees set", setFees.hash)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
