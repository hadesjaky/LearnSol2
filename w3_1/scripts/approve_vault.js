
const hre = require("hardhat");

const JKAddr = require(`../deployments/dev/JK-COIN.json`)
const VaultAddr = require(`../deployments/dev/Vault.json`)

//JK_COIN的所有者执行approve方法给Vault合约，Vault合约内部就能执行deposit方法了
async function main() {
    let [owner, second ] = await ethers.getSigners();
    let value = ethers.utils.parseUnits('10', 18);

    jkContract = await ethers.getContractAt("JK", JKAddr.address, owner);
    console.log(await jkContract.approve(VaultAddr.address, value));

    console.log(owner.address);
    console.log(value);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
