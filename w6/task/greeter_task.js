// npx hardhat help greeter
//npx hardhat greeter --address 0x5005202DB1D544e82F6EfB8F736312b64256ea9b --network OKT

task("greeter", "Prints current greeter value")
.addParam("address", "The greeter's address")
.setAction(async (taskArgs) => {
    const contractAddr = taskArgs.address;
    let greeter = await ethers.getContractAt("Greeter", contractAddr);
    let currValue = await greeter.getCounter();

    console.log("current counter value:", currValue);}
);
