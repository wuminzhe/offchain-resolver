require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');
require('hardhat-deploy-ethers');
require('dotenv').config({ path: '../../.env' });

const SUBNAME_REGISTRY_DEPLOYER_PRIVATE_KEY = process.env.SUBNAME_REGISTRY_DEPLOYER_PRIVATE_KEY || "0xa6d53aff9e991a71a1b39f553e6661bf7969930790f7aa1a23e438119f7ec7e2";
const SUBNAME_REGISTRANT_PRIVATE_KEY = process.env.SUBNAME_REGISTRANT_PRIVATE_KEY || "0xa6d53aff9e991a71a1b39f553e6661bf7969930790f7aa1a23e438119f7ec7e2";

const real_accounts = [
  SUBNAME_REGISTRY_DEPLOYER_PRIVATE_KEY,
  SUBNAME_REGISTRANT_PRIVATE_KEY
];
const gatewayurl =
  'https://offchain-resolver-example.uc.r.appspot.com/{sender}/{data}.json';

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
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ['test', 'demo'],
      chainId: 3,
      accounts: real_accounts,
      gatewayurl,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ['test', 'demo'],
      chainId: 4,
      accounts: real_accounts,
      gatewayurl,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ['test', 'demo'],
      chainId: 5,
      accounts: real_accounts,
      gatewayurl,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ['demo'],
      chainId: 1,
      accounts: real_accounts,
      gatewayurl,
    },
    darwinia: {
      url: "https://rpc.darwinia.network",
      chainId: 46,
      accounts: [SUBNAME_REGISTRY_DEPLOYER_PRIVATE_KEY],
      gasPrice: 200000000000, // 200 gwei
      gasLimit: 3000000,
      timeout: 60000 // Increase timeout to 60 seconds
    },
    koi: {
      url: "https://koi-rpc.darwinia.network",
      chainId: 701,
      accounts: [SUBNAME_REGISTRY_DEPLOYER_PRIVATE_KEY, SUBNAME_REGISTRANT_PRIVATE_KEY],
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
      default: 0,
    },
  },
};
