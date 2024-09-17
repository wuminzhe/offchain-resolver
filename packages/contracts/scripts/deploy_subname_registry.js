const hre = require("hardhat");
const { utils } = require("ethers");

// npx hardhat run scripts/deploy_subname_registry.js --network koi
async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", utils.formatEther(balance));

  const SubnameRegistryFactory = await hre.ethers.getContractFactory("DarwiniaSubnameRegistry");
  const subnameRegistry = await SubnameRegistryFactory.deploy();

  await subnameRegistry.deployed();

  console.log("DarwiniaSubnameRegistry deployed to:", subnameRegistry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });