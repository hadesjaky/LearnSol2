// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');


async function main() {
  const jk_coin = await hre.ethers.getContractFactory("JK");
  const addr = await jk_coin.deploy();

  await addr.deployed();

  console.log("JK-COIN deployed to:", addr.address);
  await writeAddr(addr.address, "JK-COIN", "dev");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
