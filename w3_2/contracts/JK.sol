// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract JK is ERC20Upgradeable {
    constructor() {
        __ERC20_init("JAKY Coin", "JK");
        _mint(msg.sender, 6 * 10 ** decimals());
    }
}
