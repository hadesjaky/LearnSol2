const { ethers } = require("hardhat");
const hre = require("hardhat");
const { writeAddr } = require('../../scripts/artifact_log.js');

const factory = require(`../../deployments/dev/UniswapV2Factory.json`);
const weth = require(`../../deployments/dev/WETH.json`);


async function main() {
    let [owner, ] = await ethers.getSigners();

    const Router = await hre.ethers.getContractFactory("UniswapV2Router01");
    const router = await Router.deploy(factory.address, weth.address);

    await router.deployed();

    console.log("Router address:", router.address);
    await writeAddr(router.address, "Router", "dev");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
