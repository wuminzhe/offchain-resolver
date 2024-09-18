require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');
require('hardhat-deploy-ethers');
require('dotenv').config({ path: '../../.env' });

const PRIVATE_KEY = process.env.PRIVATE_KEY
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY
const SUBNAME_REGISTRY_DEPLOYER_PRIVATE_KEY = process.env.SUBNAME_REGISTRY_DEPLOYER_PRIVATE_KEY;
const SUBNAME_REGISTRANT_PRIVATE_KEY = process.env.SUBNAME_REGISTRANT_PRIVATE_KEY;

const real_accounts = [
  SIGNER_PRIVATE_KEY,
  PRIVATE_KEY
];

const darwinia_accounts = [
  SUBNAME_REGISTRY_DEPLOYER_PRIVATE_KEY,
  SUBNAME_REGISTRANT_PRIVATE_KEY
]

const gatewayurl =
  'http://213.199.47.229:8080/{sender}/{data}.json';

let devgatewayurl = 'http://localhost:8080/{sender}/{data}.json';

if (process.env.REMOTE_GATEWAY) {
  devgatewayurl =
    `${process.env.REMOTE_GATEWAY}/{sender}/{data}.json`;
}
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: '0.8.17',
  networks: {
    hardhat: {
      throwOnCallFailures: false,
      gatewayurl: devgatewayurl,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ['test', 'demo'],
      chainId: 11155111,
      accounts: real_accounts,
      gatewayurl,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ['mainnet'],
      chainId: 1,
      accounts: real_accounts,
      gatewayurl,
    },
    darwinia: {
      url: "https://rpc.darwinia.network",
      chainId: 46,
      accounts: darwinia_accounts,
      gasPrice: 200000000000, // 200 gwei
      gasLimit: 3000000,
      timeout: 60000 // Increase timeout to 60 seconds
    },
    koi: {
      url: "https://koi-rpc.darwinia.network",
      chainId: 701,
      accounts: darwinia_accounts,
      gasPrice: 200000000000, // 200 gwei
      gasLimit: 3000000,
      timeout: 60000 // Increase timeout to 60 seconds
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    signer: {
      default: 0,
    },
    deployer: {
      default: 1,
    },
  },
};
