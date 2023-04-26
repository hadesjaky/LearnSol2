const { ethers } = require("hardhat");

const writeAddr = require("./artifact_log.js");
const delay = ""

const ERC20Addr = require(`../deployments/dev/GBCToken.json`)


async function main() {
    let toAddr = "0xA36eBFF50ecf1f6af96C1159FCaB01C92d7Ac7b3";
    console.log("toAddr:", toAddr);
    let [owner, ] = await ethers.getSigners();
    //console.log("Owner:", owner);

    let myerc20 = await ethers.getContractAt("GBCToken",
        ERC20Addr.address,
        owner);

    let tt = await myerc20.AddCurrency(1000);
    console.log("add Currency: ", tt);
    await myerc20.transfer(toAddr, 10);
    let toAddrBalance = await myerc20.balanceOf(toAddr);
    console.log("toAddr balance: ", toAddrBalance);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
