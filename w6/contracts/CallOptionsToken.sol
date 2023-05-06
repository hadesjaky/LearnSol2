 //SPDX-License-Identifier: Unlicense                                                                                                
 pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CallOptionsToken is ERC20, Ownable{
    using SafeERC20 for IERC20;

    uint256 public price;
    address public usdt;
    uint256 public exeTime;
    uint256 public constant during = 10 days;

    //一个ETH换3000USDT
    constructor(address _usdt) ERC20("CallOpToken", "COT"){
         usdt = _usdt;
        price = 3000;
        exeTime = block.timestamp + 100 days;
    }

    //发行方根据转入的eth发行期权token
    function mint(address people) external payable onlyOwner { 
        _mint(people, msg.value);     
    }

    //某个人要行权
    function settlement(uint256 amount) external {
        require( block.timestamp >= exeTime && block.timestamp < exeTime + during, "invalid time");
        require(amount > 0 && balanceOf(msg.sender)  >=  amount);
        _burn(msg.sender, amount);
        uint256 needUsdcAmount = price * amount;
        IERC20(usdt).safeTransferFrom(
            msg.sender,
            address(this),
            needUsdcAmount
        );
        safeTransferETH(msg.sender, amount); 
    }

    function safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, "safeTransferETH: ETH transfer failed");
    }

    function burnAll() external onlyOwner {
        require(block.timestamp >= exeTime + during, "It's OVER");
        uint256 usdtAmount = IERC20(usdt).balanceOf(address(this));
        IERC20(usdt).safeTransfer(msg.sender, usdtAmount);

        selfdestruct(payable(msg.sender));
    }
}


