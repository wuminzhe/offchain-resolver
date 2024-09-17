const hre = require("hardhat");
require('dotenv').config({ path: '../../.env' });

const REGISTRY_CONTRACT_ADDRESS = '0x3173c3e608125226A0069ba75f8feb73b221974a';

async function registerSubname(subname) {
  console.log(`Connected to network: ${hre.network.name}`);

  const [_, signer] = await hre.ethers.getSigners();
  console.log(`Using signer address: ${signer.address}`);

  try {
    const DarwiniaSubnameRegistry = await hre.ethers.getContractFactory("DarwiniaSubnameRegistry");
    console.log("Contract factory created");

    const contract = await DarwiniaSubnameRegistry.attach(REGISTRY_CONTRACT_ADDRESS).connect(signer);
    console.log("Contract attached at address:", REGISTRY_CONTRACT_ADDRESS);

    console.log("Contract ABI:", JSON.stringify(contract.interface.format('json'), null, 2));

    console.log(`Registering subname: ${subname}`);
    
    // Instead of estimating gas, use a fixed gas limit
    const gasLimit = 300000; // You can adjust this value
    console.log(`Using fixed gas limit: ${gasLimit}`);

    // Send the transaction
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
  const subname = process.argv[2] || "foo"; // Use command line argument or default to "foo"

  if (!subname) {
    console.error('Usage: npx hardhat run scripts/register_subname.js --network koi <subname>');
    process.exit(1);
  }

  await registerSubname(subname);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });