require("@nomicfoundation/hardhat-toolbox");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const fs = require('fs');
const mnemonic = fs.readFileSync("../.secret").toString().trim();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "Goerli",
  networks: {
    Goerli:{
      url: `https://goerli.infura.io/v3/${process.env.GOERLI_API_KEY}`,
      chainId: 5,
      accounts:[mnemonic]
    }
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN}`
  },
  solidity: "0.8.7",
};
