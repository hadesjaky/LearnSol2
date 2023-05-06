//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Treasury {
    constructor() public payable {
        require(msg.value >= 0.001 ether, "please send ether");
    }

    fallback() external payable {
        if(msg.value <= 0)
            return;
    }

    receive() external payable {}

    function withdraw(address to) external {
        uint256 amount = address(this).balance;
        safeTransferETH(to, amount);
    }

    function safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = payable(to).call{value: value}(new bytes(0));
        require(success, "TransferHelper::safeTransferETH: ETH transfer failed"
        );
    }
}