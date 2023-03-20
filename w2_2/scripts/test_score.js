const hre = require("hardhat");
const BankAddr = require(`../deployments/dev/Bank.json`);

// async function getTransactionInfo(txId) {
//     const provider = hre.ethers.provider;
//     const tx = await provider.getTransaction(txId);
//     const receipt = await tx.wait(2);
//     console.log(await provider.getTransaction(txId));
//     console.log(receipt.blockNumber);
//   }

async function main() {
    const provider = hre.ethers.provider;
    let [owner, ] = await hre.ethers.getSigners();
    const score = await ethers.getContractAt("Score", ScoreAddr.address, owner);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
