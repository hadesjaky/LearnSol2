const { ethers } = require("hardhat");
const hre = require("hardhat");
const { writeAddr } = require('../../scripts/artifact_log.js');

async function main() {
    let [owner, ] = await ethers.getSigners();
    
    const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
    const f = await UniswapV2Factory.deploy(owner.address);

    await f.deployed();

    console.log("UniswapV2Factory address:", f.address);
    await writeAddr(f.address, "UniswapV2Factory", "dev");

    let codeHash = await f.INIT_CODE_PAIR_HASH();
    console.log("UniswapV2Factory code hash: ", codeHash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
