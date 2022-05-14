async function main() {
  //  1. PlayerNFT (ERC721)
  const Markeplace = await ethers.getContractFactory("NFTAuction");
  const markeplace = await Markeplace.deploy();

  await markeplace.deployed();

  console.log("marketplace Contract deployed to:", markeplace.address);

  // 2. CoachNFT
  const NormalNFT = await ethers.getContractFactory("ClubVirtualNormal");
  const normalNFT = await NormalNFT.deploy(markeplace.address);

  await coach.deployed();

  console.log("NormalNFT Contract deployed to:", normalNFT.address);
  

  //  3. MetaCricket ERC20
  const LazyNFT = await ethers.getContractFactory("ClubVirtualLazyNFT");
  const lazyNFT = await LazyNFT.deploy(markeplace.address);

  await lazyNFT.deployed();

  console.log("LazyNFT Token Contract deployed to:", lazyNFT.address);

  //  4. Marketplace Contract: Auction & Buy/Sell
  const ClubVirtual1155 = await ethers.getContractFactory("ClubVirtual1155");
  const clubVirtual1155 = await ClubVirtual1155.deploy();

  await clubVirtual1155.deployed(markeplace.address);

  console.log("NFT Marketplace Contract deployed to:", clubVirtual1155.address);

  // const initialize= markeplace.initialize(normalNFT.address, lazyNFT.address, clubVirtual1155.address, deployer.address)
  // console.log("contract initilize()", initialize.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
