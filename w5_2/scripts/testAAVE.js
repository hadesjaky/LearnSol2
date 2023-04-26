const { ethers } = require("hardhat");
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');
const format = function (amount) {
    return ethers.utils.formatUnits(amount, 18)
  }

const GBCTokenAddr = require(`../deployments/dev/GBCToken.json`);
const WETHAddr = require(`../deployments/dev/WETH.json`);
const V2Router = require(`../deployments/dev/V2Router.json`);
const V3Router = require(`../deployments/dev/V3Router.json`);
const AAVE_ADDR = require(`../deployments/dev/FlashLoanAAVE.json`);


async function main() {
    let [owner,  ] = await ethers.getSigners();
    const ADDRESS_PROVIDER = '0x88757f2f99175387ab4c6a4b3067c77a695b0349'
    const FlashLoan = await ethers.getContractFactory('FlashLoanAAVE')
    flashloan = await FlashLoan.deploy(ADDRESS_PROVIDER, GBCTokenAddr.address, WETHAddr.address , V2Router.address, V3Router.address, { gasLimit: 10000000})
    console.log("FlashLoanAAVE deployed to:", flashloan.address);
    await writeAddr(flashloan.address, "FlashLoanAAVE", "dev")
    
    // const wETH = await ethers.getContractAt('WETH', WETHAddr.address , owner)
    // const gbc = await ethers.getContractAt('GBCToken', GBCTokenAddr.address, owner)
    // const aaveFlashLoan = await ethers.getContractAt('FlashLoanAAVE', AAVE_ADDR.address)

    // const BalanceOfweth = await wETH.balanceOf(owner)
    
    // console.log(`闪电贷前持有WETH: ${format(BalanceOfweth)}`)
    // await wETH.connect(owner).transfer(aaveFlashLoan.address, ethers.utils.parseUnits('0.01', 18))
    // await aaveFlashLoan.connect(owner).testFlashLoan(wETH.address, ethers.utils.parseUnits('0.05', 18))
    // const afterWETHBalance = await wETH.balanceOf(owner.address)
    // console.log(`闪电贷后持有WETH: ${format(afterWETHBalance)}`)
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });