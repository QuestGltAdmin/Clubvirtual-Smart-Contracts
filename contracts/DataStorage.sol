// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DataStorage is Ownable{
    uint16 public nftCommission; // applies to all NFTs - Paid by Seller
    uint16 public platformCommission; //  applies to all NFTs - Paid by Buyer
    address erc1155SaleMarket;
    address marketplace;

    struct Royalty {
        address royaltyOwner;
        uint256 royaltyPercentage;
        bool activated;
    }

    // keeps account of all Royalty data 
    mapping(address => mapping(uint256 => Royalty)) public nftRoyalty;
    // keeps account of all commission charges
    mapping(address => uint16) public sellerCommission;

    modifier notZeroAddress(address _address) {
        require(_address != address(0), "Given zero address");
        _;
    }

    constructor(address _erc1155SaleMarket, address _marketplace ){
        erc1155SaleMarket = _erc1155SaleMarket;
        marketplace= _marketplace;
    }

    function setRoyaltyData(
        address _nftContractAddress,
        uint256 _tokenId,
        uint256 _royaltyPercentage,
        address _royaltyOwner
    ) external {
        require(msg.sender == erc1155SaleMarket || msg.sender == marketplace, "Only run on redeem");
        require(_royaltyPercentage <=2500, "ROYALTY_PERCENTAGE_EXCEEDED");
        Royalty storage _royalty;
        if(msg.sender == erc1155SaleMarket) {
             _royalty = nftRoyalty[erc1155SaleMarket][_tokenId];
        }
        else{
            _royalty = nftRoyalty[_nftContractAddress][_tokenId];
        }
        
        _royalty.royaltyOwner = _royaltyOwner;
        _royalty.royaltyPercentage = _royaltyPercentage;
        _royalty.activated = false;
    }

    function editFees(
        address _artist,
        uint16 _ownerPercent,
        uint16 _platformFee,
        uint16 _nftCommission
    ) external onlyOwner notZeroAddress(_artist) {
        if (sellerCommission[_artist] != _ownerPercent) {
            sellerCommission[_artist] = uint16(_ownerPercent);
        }
        if (platformCommission != _platformFee) {
            platformCommission = _platformFee;
        }
        if (nftCommission != _nftCommission) {
            nftCommission = _nftCommission;
        }
    }

    function setMarketplace(address _marketplace) external onlyOwner{
        marketplace = _marketplace;
    }

    function activateRoyalty(address _nftContractAddress, uint _tokenId) external {
        require(msg.sender == erc1155SaleMarket || msg.sender == marketplace, "Only run on redeem");
        nftRoyalty[_nftContractAddress][_tokenId].activated= true;
    }

    function setRoyaltyPercentage(address _nftContractAddress, uint _tokenId, uint256 _newPercentage) external{
        require(msg.sender == erc1155SaleMarket || msg.sender == marketplace, "Only run on redeem");
        require(_newPercentage <=2500, "ROYALTY_PERCENTAGE_EXCEEDED");
        nftRoyalty[_nftContractAddress][_tokenId].royaltyPercentage= _newPercentage;
    }

    function getRoyaltyPercentage(address _nftContractAddress, uint _tokenId) external view returns (uint){
        return nftRoyalty[_nftContractAddress][_tokenId].royaltyPercentage;
    }

    function getRoyaltyOwner(address _nftContractAddress, uint _tokenId) external view returns (address){
        return nftRoyalty[_nftContractAddress][_tokenId].royaltyOwner;
    }

    function isActivated(address _nftContractAddress, uint _tokenId) external view returns (bool){
        return nftRoyalty[_nftContractAddress][_tokenId].activated;
    }

}