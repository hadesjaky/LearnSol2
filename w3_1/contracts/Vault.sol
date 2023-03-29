// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
    struct Deposit {
        uint256 amount;
        bool deposited;
    }

    mapping(address => Deposit) public deposits;

    function deposit(
        address token,
        address user,
        uint256 amount,
        bytes memory signature
    ) public {
        bytes32 message = keccak256(abi.encodePacked(token, user, amount));
        address signer = recoverSigner(message, signature);
        require(signer == user, "Vault: invalid signature");

        Deposit storage userDeposit = deposits[user];
        require(!userDeposit.deposited, "Vault: deposit already made");

        SafeERC20.safeTransferFrom(IERC20(token), user, address(this), amount);

        userDeposit.amount = amount;
        userDeposit.deposited = true;
    }

    function recoverSigner(
        bytes32 message,
        bytes memory signature
    ) public pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        if (signature.length != 65) {
            return address(0);
        }

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        if (v != 27 && v != 28) {
            return address(0);
        } else {
            return ecrecover(message, v, r, s);
        }
    }
}
