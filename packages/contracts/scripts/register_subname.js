const hre = require("hardhat");
require('dotenv').config({ path: '../../.env' });

const REGISTRY_CONTRACT_ADDRESS = '0xa4656066De65A7D66a8a60e1077e99C43C4490cD';

// npx hardhat run scripts/register_subname.js --network koi
async function registerSubname(subname) {
  console.log(`Connected to network: ${hre.network.name}`);

  const [_, signer] = await hre.ethers.getSigners();
  console.log(`Using signer address: ${signer.address}`);

  try {
    const DarwiniaSubnameRegistry = await hre.ethers.getContractFactory("DarwiniaSubnameRegistry");

    const contract = await DarwiniaSubnameRegistry.attach(REGISTRY_CONTRACT_ADDRESS).connect(signer);
    console.log("DarwiniaSubnameRegistry address:", REGISTRY_CONTRACT_ADDRESS);

    console.log(`Registering subname: ${subname}`);
    
    const gasLimit = 300000;
    console.log(`Using fixed gas limit: ${gasLimit}`);

    const tx = await contract.registerSubname(subname, {
      gasLimit: gasLimit
    });
    console.log(`Transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Subname "${subname}" registered successfully!`);
  } catch (error) {
    console.error('Error registering subname:', error);
    if (error.error && error.error.message) {
      console.error('Error message:', error.error.message);
    }
  }
}

async function main() {
  const subname = "bar";

  console.log(`Subname to register: ${subname}`);

  await registerSubname(subname);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });