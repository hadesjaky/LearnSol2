// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Market is Ownable {
    address public TokenAddress;
    address public NFTAddress;
    using SafeMath for uint;

    using EnumerableMap for EnumerableMap.UintToUintMap;
    EnumerableMap.UintToUintMap private nftMarket; //key:id,value:price

    constructor(address _token, address _nftAddr) {
        TokenAddress = _token;
        NFTAddress = _nftAddr;
    }

    function setTokenAddr(address _token) public onlyOwner {
        TokenAddress = _token;
    }

    function setNFTAddr(address _nftAddr) public onlyOwner {
        NFTAddress = _nftAddr;
    }

    function getAllMarket() public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](nftMarket.length());
        for (uint256 i = 0; i < nftMarket.length(); i++) {
            (result[i], ) = nftMarket.at(i);
        }
        return result;
    }

    function checkInMarket(uint256 _tokenId) private view returns (bool) {
        return nftMarket.contains(_tokenId);
    }

    function searchTokenPrice(uint256 _tokenId) public view returns (uint256) {
        uint256 price = 0;
        bool ok = false;
        (ok, price) = nftMarket.tryGet(_tokenId);
        if (!ok) return 0;
        return price;
    }

    function setPrice(uint _id, uint _price) public {
        address owner = msg.sender;
        IERC721 ntf = IERC721(NFTAddress);
        require(ntf.ownerOf(_id) == owner, "You're not the owner");
        if (_price == 0) {
            nftMarket.remove(_id);
            return;
        }
        nftMarket.set(_id, _price);
    }

    //逻辑：nft的所有者需要approve赋予市场合约权限，Token所有者也需要赋予市场合约权限，给定足够金额才会成功执行buyNFT方法
    function buyNFT(uint _id, uint _price) public {
        IERC721 ntf = IERC721(NFTAddress);
        uint price = searchTokenPrice(_id);
        address owner = ntf.ownerOf(_id);
        require(checkInMarket(_id), "ntf not in market!");
        require(_price >= price, "price is error!!!");

        SafeERC20.safeTransferFrom(
            IERC20(TokenAddress),
            msg.sender,
            owner,
            _price
        );

        ntf.safeTransferFrom(owner, msg.sender, _id);
        nftMarket.remove(_id);
    }
}
