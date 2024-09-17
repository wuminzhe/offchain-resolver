const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", await deployer.getAddress());

  const gasPrice = ethers.parseUnits("200", "gwei"); // Set a fixed gas price
  console.log("Using gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

  const DarwiniaSubnameRegistry = await ethers.getContractFactory("DarwiniaSubnameRegistry");
  const registry = await DarwiniaSubnameRegistry.deploy({
    gasPrice: gasPrice,
    gasLimit: 3000000 // Set a fixed gas limit
  });

  await registry.waitForDeployment();
  console.log("DarwiniaSubnameRegistry deployed to:", await registry.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });