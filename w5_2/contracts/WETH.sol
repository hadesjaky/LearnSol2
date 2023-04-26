//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WETH is ERC20, Ownable{

    constructor() ERC20("W ETH", "WETH"){
        _mint(msg.sender, 10000 * 10 **18);
    }

    function AddCurrency(uint256 _total) public onlyOwner{
        _mint(msg.sender, _total);
    }
}
