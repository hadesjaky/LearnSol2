
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const GBCTokenAddr = require(`../deployments/dev/GBCToken.json`)



async function main() {
  const GBCToken = await hre.ethers.getContractFactory("GBCToken");
  const gbc = await GBCToken.deploy();

  await gbc.deployed();

  console.log("GBCToken deployed to:", gbc.address);
  await writeAddr(gbc.address, "GBCToken", "dev")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
