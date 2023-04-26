const { ethers } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');
const fs = require('fs');
const util = require('util');

const GBCTokenAddr = require(`../deployments/dev/GBCToken.json`);
const WETHAddr = require(`../deployments/dev/WETH.json`);
const MarketAddr = require(`../deployments/dev/MyTokenMarket.json`);
const RouterAddr = require(`../deployments/dev/Router.json`);
const FactoryAddr = require(`../deployments/dev/UniswapV2Factory.json`);



async function main() {
    let [owner, ] = await ethers.getSigners();
    const gbc = await ethers.getContractAt("GBCToken", GBCTokenAddr.address, owner);
    const weth = await ethers.getContractAt("WETH", WETHAddr.address, owner);
    const market = await  ethers.getContractAt("MyTokenMarket", MarketAddr.address, owner);
    //const factory = await  ethers.getContractAt("UniswapV2Factory", FactoryAddr.address, owner);
    
    await gbc.approve(MarketAddr.address,  ethers.constants.MaxUint256);
    await weth.approve(MarketAddr.address,  ethers.constants.MaxUint256);

    let ethValue = ethers.utils.parseUnits("1", 18);
    await gbc.transfer(RouterAddr.address,  ethValue);
    await weth.transfer(RouterAddr.address,  ethValue);
    console.log(await gbc.balanceOf(RouterAddr.address));
    console.log(await weth.balanceOf(RouterAddr.address));
    console.log(await weth.balanceOf(owner.address));
    
    console.log(await market.myToken());
    console.log(await market.router());
    console.log(await market.weth());
    console.log("======Start AddLiquidity===========");
    await market.AddLiquidity(ethValue, {value: ethValue, gasLimit: 400000}); //默认的gasLimit 会导致交易失败
    console.log("======AddLiquidity===========");
    let gbcBalance = await gbc.balanceOf(owner.address);

    console.log("ETH-GBC 流动性: ${ethValue}, GBCToken: ", gbcBalance);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
