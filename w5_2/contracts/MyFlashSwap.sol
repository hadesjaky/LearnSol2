// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol";
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract MyFlashSwap is IUniswapV2Callee {
    using SafeERC20 for IERC20;

    //0.3% fee
    uint24 FREE = 3000; 
    address immutable WETH;
    address immutable factory_V2;
    address immutable router_V3;
    uint256 MAX_INT = 2 ** 256 - 1;

    constructor(address _WETH, address _factory_V2, address _routerV3) public {
        WETH = _WETH;
        factory_V2 = _factory_V2;
        router_V3 = _routerV3;
    }

    receive() external payable {}

    event LogEvent(string message, uint value);

    function testFlashSwap(address _GBCtoken, uint _amount) external {
        address pair = IUniswapV2Factory(factory_V2).getPair(_GBCtoken, WETH);
        require(pair != address(0), "V2 : not pair");
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        uint amount0Out = _GBCtoken == token0 ? _amount : 0;
        uint amount1Out = _GBCtoken == token1 ? _amount : 0;
        
        bytes memory data = abi.encode(_GBCtoken, WETH, _amount, msg.sender);
        console.log(amount0Out);
        console.log(amount1Out);

        IERC20(_GBCtoken).approve(pair, MAX_INT);
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
    }

    function uniswapV2Call(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external override {
        (address gbcToken, address weth, uint amount, address initiator) = abi.decode(data, (address, address, uint, address));
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        address pair = IUniswapV2Factory(factory_V2).getPair(token0, token1);

        require(msg.sender == pair, "not pair");        
        require(sender == address(this), "not sender");

      // about 0.3%, 还回去的时候需要带上手续费
        uint fee = ((amount * 3) / 997) + 1;
        uint reValue = amount + fee;

        emit LogEvent("amount", amount);
        emit LogEvent("amount0", amount0);
        emit LogEvent("amount1", amount1);
        emit LogEvent("fee", fee);
        emit  LogEvent("amount to repay", reValue);

        IERC20(gbcToken).transfer(pair, reValue);

        //taoli
        uint balanceOfGBC = IERC20(gbcToken).balanceOf(address(this));        
        uint balanceOfWETH = IERC20(weth).balanceOf(address(this));
         TransferHelper.safeApprove(gbcToken, router_V3, balanceOfGBC);
        ISwapRouter.ExactInputSingleParams memory params =
        ISwapRouter.ExactInputSingleParams({
        tokenIn : gbcToken,
        tokenOut : weth,
        fee : FREE,
        recipient : address(this),
        deadline : block.timestamp,
        amountIn : balanceOfGBC,
        amountOutMinimum : 0,
        sqrtPriceLimitX96 : 0
        });

        uint amountOut = ISwapRouter(router_V3).exactInputSingle(params);
        console.log('after uniswap v3 , AToken amount >>> ', IERC20(gbcToken).balanceOf(address(this)));
        console.log('after uniswap v3 , BToken amount >>> ', IERC20(weth).balanceOf(address(this)));

        //3.套利剩余金额返回发起人
        console.log('initiator',initiator);
        if (IERC20(gbcToken).balanceOf(address(this)) > 0) {
            IERC20(gbcToken).transfer(initiator, IERC20(gbcToken).balanceOf(address(this)));
        }
        if (IERC20(weth).balanceOf(address(this)) > 0) {
            IERC20(weth).transfer(initiator, IERC20(weth).balanceOf(address(this)));
        }
    }
}