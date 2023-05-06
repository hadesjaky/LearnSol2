
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const USDTTokenAddr = require(`../deployments/dev/USDTToken.json`)



async function main() {
  const Options = await hre.ethers.getContractFactory("CallOptionsToken");
  const options = await Options.deploy(USDTTokenAddr.address);

  await options.deployed();

  console.log("Options deployed to:", options.address);
  await writeAddr(options.address, "Options", "dev")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
