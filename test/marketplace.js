const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const {Contract, Signer} = require("ethers")
const {BigNumber} = require('bignumber.js');
const { getContractFactory } = require("@nomiclabs/hardhat-ethers/types");

let zeroAddr= "0x0000000000000000000000000000000000000000"
let marketplace = Contract,
ERC721= Contract
let deployer= Signer, user= Signer

describe("Create Auction", function () {
    
    it("Should fail if auction period is less than 10 min", async function () {
        let Marketplace = await ethers.getContractFactory("ClubVirtualMarketplaceERC721")
        marketplace = await Marketplace.deploy()
        let erc721 = await ethers.getContractFactory("ClubVirtualERC721")
        ERC721= await erc721.deploy(marketplace.address)

        await expect(marketplace.createNewNFTAuction(
            zeroAddr,
            0,
            zeroAddr, 
            1000000,
            1000,
            599,
            100,
            0,
            "Quest"
        )).to.be.reverted
    })

    it("Should pass if auction period >= 10 min", async function () {
        let Marketplace = await ethers.getContractFactory("ClubVirtualMarketplaceERC721")
        const marketplace = await Marketplace.deploy()

        await expect(
            marketplace.connect.(deployer).createNewNFTAuction(
                zeroAddr,
                0,
                zeroAddr, 
                1000000,
                1000,
                1000,
                100,
                100,
                "Quest123"
            )
        ).to.not.be.reverted
    })
})