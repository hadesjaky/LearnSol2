require("@nomiclabs/hardhat-waffle");
//require("nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html


const fs = require('fs');
const mnemonic = fs.readFileSync("../../.secret").toString().trim();

module.exports = {
  defaultNetwork: "OKT",
  networks: {
    hardhat:{
    },
    OKT: {
      url: "https://exchaintestrpc.okex.org",
      chainId: 65,
      accounts:[mnemonic]
    }
  },
  solidity: {                                                               
        version: "0.5.16",
        settings: {
        optimizer: {
            enabled: true,
            runs: 200
          }
    }
  },
  abiExporter: {
    path: '../deployments/Factory/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },
  mocha: {
      timeout: 20000
    }
};
