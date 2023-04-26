const { ethers } = require("hardhat");
const hre = require("hardhat");
const { writeAddr } = require('../../scripts/artifact_log.js');

const GBCTokenAddr = require(`../../deployments/dev/GBCToken.json`);
const WETHAddr = require(`../../deployments/dev/WETH.json`);
const FactoryAddr = require(`../../deployments/dev/UniswapV2Factory.json`);

async function main() {
    let [owner, ] = await ethers.getSigners();

    const factory = await  ethers.getContractAt("UniswapV2Factory", FactoryAddr.address,  owner);

    let pairAddr = await factory.createPair(GBCTokenAddr.address, WETHAddr.address);

    console.log("pair address:", pairAddr.address);
    await writeAddr(pairAddr.address, "Pair", "dev");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
