
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');


async function main() {
  const WETH = await hre.ethers.getContractFactory("WETH");
  const weth = await WETH.deploy();

  await weth.deployed();

  console.log("WETH deployed to:", weth.address);
  await writeAddr(weth.address, "WETH", "dev")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
