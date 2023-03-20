// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');


async function main() {
  const Teacher = await hre.ethers.getContractFactory("Teacher");
  const addr = await Teacher.deploy();

  await addr.deployed();

  console.log("Teacher deployed to:", addr.address);
  await writeAddr(Teacher.address, "Teacher", "dev");


  const Score = await hre.ethers.getContractFactory("Score");
  const scoreAddr = await Score.deploy();

  await scoreAddr.deployed();

  console.log("Score deployed to:", scoreAddr.address);
  await writeAddr(scoreAddr.address, "Score", "dev");


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
