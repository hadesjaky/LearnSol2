// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');
const JKAddr = require(`../deployments/dev/JK-COIN.json`)
const VaultAddr = require(`../deployments/dev/Vault.json`)



async function main() {
  const Resolver = await hre.ethers.getContractFactory("Resolver");
  const addr = await Resolver.deploy(JKAddr.address, VaultAddr.address);

  await addr.deployed();

  console.log("Resolver deployed to:", addr.address);
  await writeAddr(addr.address, "Resolver", "dev");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
