
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

// const GBCTokenAddr = require(`../deployments/dev/USDTToken.json`)



async function main() {
    let ethValue = ethers.utils.parseUnits("0.001", 18);

    const Treasury = await hre.ethers.getContractFactory("Treasury");
    const treasury = await Treasury.deploy({value:ethValue});

    await treasury.deployed();

    console.log("Treasury deployed to:", treasury.address);
    await writeAddr(treasury.address, "Treasury", "dev")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
