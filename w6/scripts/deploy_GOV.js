
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const TreasuryAddr = require(`../deployments/dev/Treasury.json`)



async function main() {
    const GOV = await hre.ethers.getContractFactory("GOV");
    const gov = await GOV.deploy(TreasuryAddr.address);

    await gov.deployed();

    console.log("GOV deployed to:", gov.address);
    await writeAddr(gov.address, "GOV", "dev")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
