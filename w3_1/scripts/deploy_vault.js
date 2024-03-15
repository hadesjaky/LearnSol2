// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');


async function main() {
  const Vault = await hre.ethers.getContractFactory("Vault");
  const addr = await Vault.deploy("0x81ED87C072E3B83E01c9C2438BA515809515efe7");
  console.log(addr)
  await addr.deployed();

  console.log("Vault deployed to:", addr.address);
  await writeAddr(addr.address, "Vault", "dev");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
