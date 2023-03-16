// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bank is Ownable {
    mapping(address => uint256) private balances;
    uint256 public allEth = 0;

    event Deposit(address indexed from, uint256 value);
    event Withdraw(address indexed to, uint256 value);

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
        allEth += msg.value;
    }

    function withdraw() public {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdraw failed");

        balances[msg.sender] = 0;
        allEth = allEth - balance;
        emit Withdraw(msg.sender, balance);
    }

    function withdrawAll() public onlyOwner {
        (bool success, ) = msg.sender.call{value: allEth}("");
        require(success, "WithdrawAll failed");
    }

    receive() external payable {
        deposit();
    }
}
