// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanReceiverBase.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanReceiver.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "hardhat/console.sol";

contract FlashLoanAAVE is FlashLoanReceiverBase  {
    using SafeMath for uint;

    //0.3% fee
    uint24 FEE = 3000; 
    address immutable GBC;
    address immutable WETH;
    address immutable router_v2;
    address immutable router_V3;

    constructor(IPoolAddressesProvider _addressProvider, address _GBC, address _WETH, address _router_v2, address _routerV3) public FlashLoanReceiverBase(_addressProvider){
        GBC = _GBC;
        WETH = _WETH;
        router_v2 = _router_v2;
        router_V3 = _routerV3;
    }

    event Log(string message, uint val);

    function testFlashLoan(address asset, uint amount) external {
        uint bal = IERC20(asset).balanceOf(address(this));
        address receiver = address(this);
        address[] memory assets = new address[](1);
        assets[0] = asset;
        uint[] memory amounts = new uint[](1);
        amounts[0] = amount;

        // 0 = pay all loaned
        uint[] memory modes = new uint[](1);
        modes[0] = 0; //债务相关，0是没有债务 0 = no debt, 1 = stable, 2 = variable
        address onBehalfOf = address(this);
        bytes memory params = abi.encode(msg.sender, assets);

        uint16 referralCode = 0; //0 没有中间人
       POOL.flashLoan(
            receiver,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }

    // 闪电贷执行过程必须实现的
    function executeOperation(
        address[] calldata assets,
        uint[] calldata amounts,
        uint[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        for (uint i = 0; i < assets.length; i++) {
            uint bal = IERC20(assets[i]).balanceOf(address(this));
            emit Log("borrowed", amounts[i]);
            emit Log("fee", premiums[i]);
            uint amountOwing = amounts[i].add(premiums[i]);
            console.log('balance>>', bal);
            console.log('amountOwing>>', amountOwing);
            _arbitrageOnUniswap(assets[i], amounts[i]);
            //3. repay to Aave
            IERC20(assets[i]).approve(address(POOL), amountOwing);
            //4. Transfer remaining tokens to initiator
            uint assetBalance = IERC20(assets[i]).balanceOf(address(this));
            console.log('afterBalance>>', assetBalance);
            (address originAddress, address[] memory assets) = abi.decode(params, (address, address[]));
            if (assetBalance.sub(amountOwing) > 0) {
                IERC20(assets[i]).transfer(originAddress, assetBalance.sub(amountOwing));
            }
        }
        return true;
    }

    function _arbitrageOnUniswap(address asset, uint amount) internal {
        // 1.从 uniswap v2 中使用 WETH 兑换 GBC
        uint _amountOutMin = 0;
        IERC20(asset).approve(router_v2, amount);
        address[] memory path;
        path = new address[](2);
        path[0] = asset;
        path[1] = GBC;
        IUniswapV2Router02(router_v2).swapExactTokensForTokens(
            amount,
            _amountOutMin,
            path,
            address(this),
            block.timestamp
        );
        uint balanceOfGBC = IERC20(GBC).balanceOf(address(this));

        console.log('after uniswap v2 , GBC amount >>> ', balanceOfGBC);
        console.log('after uniswap v2 , WETH amount >>> ', IERC20(asset).balanceOf(address(this)));
        // 2.从 uniswap v3 中使用 gbc 兑换 weth
        // Approve the router to spend
        TransferHelper.safeApprove(GBC, router_V3, balanceOfGBC);
        // create params of swap
        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
        ISwapRouter.ExactInputSingleParams({
        tokenIn : GBC,
        tokenOut : asset,
        fee : FEE,
        recipient : address(this),
        deadline : block.timestamp,
        amountIn : balanceOfGBC,
        amountOutMinimum : 0,
        sqrtPriceLimitX96 : 0
        });

        // The call to `exactInputSingle` executes the swap given the route.
        console.log('=debug==');
        console.log(GBC);
        console.log(asset);
        console.log(FEE);
        console.log(address(this));
        console.log(block.timestamp);
        console.log(balanceOfGBC);
        console.log('===');
        uint amountOut = ISwapRouter(router_V3).exactInputSingle(params);
        console.log('after uniswap v3 , GBC amount >>> ', IERC20(GBC).balanceOf(address(this)));
        console.log('after uniswap v3 , WETH amount >>> ', IERC20(asset).balanceOf(address(this)));
    }
}
