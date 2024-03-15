//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Vault {
    mapping(address => uint) public deposited;
    address public immutable token;

    using SafeMath for uint;

    constructor(address _token) {
        token = _token;
    }

    function permitDeposit(
        address user,
        uint amount,
        uint deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        IERC20Permit(token).permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        deposit(user, amount);
    }

    function deposit(address user, uint amount) public {
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer from error"
        );
        deposited[user] += amount;
    }

    function withdraw(uint amount) public {
        uint money = deposited[msg.sender];
        require(money >= 0, "No Money!");
        (bool ok, ) = money.trySub(amount);
        require(ok, "Not Enough!");
        require(
            IERC20(token).transfer(msg.sender, amount),
            "Transfer from error"
        );
        deposited[msg.sender] = deposited[msg.sender].sub(amount);
    }
}
