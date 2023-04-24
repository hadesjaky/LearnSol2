const hre = require("hardhat");
const util = require('util');

const JKAddr = require(`../deployments/dev/JK-COIN.json`)
const VaultAddr = require(`../deployments/dev/Vault.json`)

const format = function (amount) {
    return ethers.utils.formatUnits(amount, 18)
  }


async function main() {
    let [owner, second ] = await ethers.getSigners();
    let value = ethers.utils.parseUnits('10', 18);

    // jkContract = await ethers.getContractAt("JK", JKAddr.address, owner);
    // console.log(await jkContract.approve(VaultAddr.address, value));

    console.log(owner.address);
    console.log(value);
    vaultContract = await ethers.getContractAt("Vault", VaultAddr.address, owner)
    console.log(await vaultContract.deposit(owner.address, value));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
