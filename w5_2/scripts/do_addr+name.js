
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const fs = require('fs');
const path = require('path');
const util = require('util');

async function main() {
   // await writeAddr("0x9B55223779671AE82Ad2462a9B4a6563097DB2Ab", "GBCToken", "dev")
   let [owner, ] = await ethers.getSigners();
   //console.log(owner);
   const readFile = util.promisify(fs.readFile);
   let j = await readFile("./deployments/Factory/abi/UniswapV2Factory.json", 'utf8');
   console.log(j);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
