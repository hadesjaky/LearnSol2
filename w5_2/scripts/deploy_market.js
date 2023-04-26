
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const GBCTokenAddr = require(`../deployments/dev/GBCToken.json`)
const RouterAddr = require(`../deployments/dev/Router.json`)
const WETHAddr = require(`../deployments/dev/WETH.json`)



async function main() {
  const Market = await hre.ethers.getContractFactory("MyTokenMarket");
  const market = await Market.deploy(GBCTokenAddr.address, RouterAddr.address, WETHAddr.address);

  await market.deployed();

  console.log("MyTokenMarket deployed to:", market.address);
  await writeAddr(market.address, "MyTokenMarket", "dev")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
