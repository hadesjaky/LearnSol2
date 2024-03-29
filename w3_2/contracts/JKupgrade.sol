// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract JKupgrade is ERC20Upgradeable {
    function initialize() public initializer {
        __ERC20_init("JK Coin", "JK");
        _mint(msg.sender, 10 ** decimals());
    }

    function transferWithCallback(
        address recipient,
        uint256 amount
    ) external returns (bool) {
        _transfer(msg.sender, recipient, amount);
        if (isContract(recipient)) {
            bool rv = TokenRecipient(recipient).tokensReceived(
                msg.sender,
                amount
            );
            require(rv, "No tokensReceived");
        }
        return true;
    }

    function isContract(address _addr) internal view returns (bool) {
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(_addr)
        }
        return codeSize > 0;
    }
}

interface TokenRecipient {
    function tokensReceived(
        address addr,
        uint256 amount
    ) external returns (bool);
}
