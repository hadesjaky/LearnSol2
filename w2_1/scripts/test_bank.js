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
    const bank = await ethers.getContractAt("Bank", BankAddr.address, owner);

    let ethValue = ethers.utils.parseUnits("1", 17);
    console.log(await bank.allEth());
    //先充值，再提现，再充值，全提现
    let tx1 = await bank.deposit({value: ethValue});
    const receipt = await tx1.wait(2);
    // console.log(receipt);
    console.log(await provider.getTransaction(receipt.transactionHash));
    console.log(receipt.blockNumber);
    console.log(await bank.allEth());

    let tx2 = await bank.withdraw();
    const receipt2 = await tx2.wait(2);
    console.log(await provider.getTransaction(receipt2.transactionHash));
    console.log(receipt2.blockNumber);
    console.log(await bank.allEth());

    let tx3 = await bank.deposit({value: ethValue});
    const receipt3 = await tx3.wait(1);
    console.log(await provider.getTransaction(receipt3.transactionHash));
    console.log(receipt3.blockNumber);
    console.log(await bank.allEth());

    let tx4 = await bank.withdrawAll();
    const receipt4 = await tx4.wait(1);
    console.log(await provider.getTransaction(receipt4.transactionHash));
    console.log(receipt4.blockNumber);
    console.log(await bank.allEth());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
