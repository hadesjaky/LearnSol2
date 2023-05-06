const util = require('util');

const GBCTokenAddr = require(`../deployments/dev/GBCToken.json`);
// const TreasuryAddr = require(`../deployments/dev/Treasury.json`)
const GovAddr = require(`../deployments/dev/GOV.json`);



async function main() {
    let [owner, ] = await ethers.getSigners();
    const gbc = await ethers.getContractAt("GBCToken", GBCTokenAddr.address, owner);
    const gov = await ethers.getContractAt("GOV", GovAddr.address, owner);
    
    console.log(await gbc.balanceOf(owner.address));
    //发布一个Id为1的提案
    let proposeId = ethers.utils.parseUnits("1", 0);;
    console.log(proposeId);
    // console.log("======vote before0===========");
    // await gov.propose(proposeId);
    // console.log("======vote before1===========");
    //为Id为1的提案投票
    await gov.vote(proposeId, true);
    console.log("======vote after===========");
    console.log(await gov.proposals(proposeId));
    let gbcBalance = await gbc.balanceOf(owner.address);

    // let ethValue = ethers.utils.parseUnits("1", 18);
    // console.log("Owner : ${ethValue}, GBCToken: ", gbcBalance);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
