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

    struct Affiliate {
        uint16 feePercent;
        address affiliateAddr;
    }

    // keeps account of all Royalty data 
    mapping(address => mapping(uint256 => Royalty)) public nftRoyalty;
    // keeps account of all commission charges
    mapping(address => Affiliate[3]) public sellerCommission;

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
        require(msg.sender == erc1155SaleMarket || msg.sender == marketplace, "UNAUTORIZED");
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
        Affiliate[3] memory _a,
        uint16 _platformFee,
        uint16 _nftCommission
    ) external onlyOwner notZeroAddress(_artist) {
        
        // seller commission
        if(_a.length > 0){
            Affiliate[3] storage a = sellerCommission[_artist]; 
            for(uint8 i=0; i<3; i++){
                a[i].feePercent = _a[i].feePercent;
                a[i].affiliateAddr = _a[i].affiliateAddr;
            }
        }

        if (platformCommission != _platformFee) {
            platformCommission = _platformFee;
        }
        if (nftCommission != _nftCommission) {
            nftCommission = _nftCommission;
        }
    }

    function setInitData(address _marketplace, address _erc1155SaleMarket) external onlyOwner{
        marketplace = _marketplace;
        erc1155SaleMarket= _erc1155SaleMarket;
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

    function getSellerCommission(address _artist) public view returns(Affiliate[3] memory) {
        return sellerCommission[_artist];
    }

    function isActivated(address _nftContractAddress, uint _tokenId) external view returns (bool){
        return nftRoyalty[_nftContractAddress][_tokenId].activated;
    }

}