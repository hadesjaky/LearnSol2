const { ethers } = require("hardhat");
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');
const format = function (amount) {
    return ethers.utils.formatUnits(amount, 18)
  }

const GBCTokenAddr = require(`../deployments/dev/GBCToken.json`);
const WETHAddr = require(`../deployments/dev/WETH.json`);
const FactoryV2Addr = require(`../deployments/dev/UniswapV2Factory.json`);
// const FactoryV3Addr = require(`../deployments/dev/UniswapV3Factory.json`);
const V3Router = require(`../deployments/dev/V3Router.json`);
const FlashSWAP = require(`../deployments/dev/FlashSwap.json`);


async function main() {
    let [owner, second ] = await ethers.getSigners();
    // const FlashSwap = await ethers.getContractFactory('MyFlashSwap')
    // flashSwap = await FlashSwap.deploy(WETHAddr.address , FactoryV2Addr.address, V3Router.address)
    // console.log("FlashSwap deployed to:", flashSwap.address);
    // await writeAddr(flashSwap.address, "FlashSwap", "dev")
    
    flashSwap = await ethers.getContractAt('MyFlashSwap', FlashSWAP.address , owner)
    //先放100个两种币近flash，然后计算闪电兑换后，flash地址还剩多少，这样能防止失败和计算费率
    const wETH = await ethers.getContractAt('WETH', WETHAddr.address , owner)
    const gbc = await ethers.getContractAt('GBCToken', GBCTokenAddr.address, owner)
    const flashSwapBalanceOfweth = await wETH.balanceOf(flashSwap.address)
    const flashSwapBalanceOfgbc = await gbc.balanceOf(flashSwap.address)

    if (flashSwapBalanceOfweth < ethers.utils.parseUnits('1', 18)) {
        await wETH.transfer(flashSwap.address, ethers.utils.parseUnits('1', 18))
    }
      if (flashSwapBalanceOfgbc < ethers.utils.parseUnits('10', 18)) {
        await gbc.transfer(flashSwap.address, ethers.utils.parseUnits('10', 18))
    }

    let borrowAmount = ethers.utils.parseUnits('10', 18)
    // console.log(flashSwap);

    console.log('闪电兑换执行前flash地址上的余额--->>>');
    const beforeGBC = await gbc.balanceOf(flashSwap.address);
    const beforeWETH = await wETH.balanceOf(flashSwap.address);
    console.log(`flash拥有GBC：${format(beforeGBC)}`);
    console.log(`flash拥有WETH：${format(beforeWETH)}`);

    await flashSwap.testFlashSwap(GBCTokenAddr.address, borrowAmount, { gasLimit: 10000000});

    console.log('闪电兑换执行后flash地址上的余额--->>>');
    const afterATokenBalance = await gbc.balanceOf(flashSwap.address);
    const afterWETHBalance = await wETH.balanceOf(flashSwap.address);
    console.log(`合约拥有WETH：${format(afterWETHBalance)}`);
    console.log(`合约拥有GBCToken：${format(afterATokenBalance)}`);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
