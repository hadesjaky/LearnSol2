const { ethers } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const GBCTokenAddr = require(`../deployments/dev/GBCToken.json`);
const MarketAddr = require(`../deployments/dev/MyTokenMarket.json`);
const RouterAddr = require(`../deployments/dev/Router.json`);
const FactoryAddr = require(`../deployments/dev/UniswapV2Factory.json`);
const WETHAddr = require(`../deployments/dev/WETH.json`);
const MiniPoolAddr = require(`../deployments/dev/MiniPool.json`);


async function main() {
    let [owner, ] = await ethers.getSigners();
    const gbc = await ethers.getContractAt("GBCToken", GBCTokenAddr.address, owner);
    const weth = await ethers.getContractAt("WETH", WETHAddr.address, owner);
    const market = await  ethers.getContractAt("MyTokenMarket", MarketAddr.address, owner);
    const pool = await  ethers.getContractAt("MiniSwapPool", MiniPoolAddr.address, owner);

    // const Pool = await ethers.getContractFactory("MiniSwapPool");
    // const pool = await Pool.deploy(GBCTokenAddr.address, WETHAddr.address);
    // await pool.deployed();
    console.log("MiniPool deployed to:", pool.address);
   //await writeAddr(pool.address, "MiniPool", "dev")

    await gbc.approve(pool.address,  ethers.constants.MaxUint256);
    await weth.approve(pool.address,  ethers.constants.MaxUint256);

    await pool.add(ethers.utils.parseUnits("2", 18) , ethers.utils.parseUnits("1", 18));
     let wethBalance = await weth.balanceOf(pool.address);
     console.log(wethBalance);


    // let ethValue = ethers.utils.parseUnits("1", 18);
    // let ggbcBalance = await gbc.balanceOf(owner.address);
    // let wethBalance = await weth.balanceOf(owner.address);
    // console.log(ggbcBalance);
    // console.log(wethBalance);
    // console.log("======Start AddLiquidity===========");
    // await market.AddLiquidity(ethValue, {value: ethValue});
    // console.log("======AddLiquidity===========");
    // let gbcBalance = await gbc.balanceOf(owner.address);
    // console.log("ETH-GBC 流动性: ${ethValue}, GBCToken: ", gbcBalance);
    //await GBCTokenAddr.address.approve(MarketAddr.address, ethers.constants.MaxUint256);
    

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
