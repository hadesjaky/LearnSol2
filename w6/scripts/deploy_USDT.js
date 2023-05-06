
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

// const GBCTokenAddr = require(`../deployments/dev/USDTToken.json`)



async function main() {
  const USDTToken = await hre.ethers.getContractFactory("USDTToken");
  const usdt = await USDTToken.deploy();

  await usdt.deployed();

  console.log("USDTToken deployed to:", usdt.address);
  await writeAddr(usdt.address, "USDTToken", "dev")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
