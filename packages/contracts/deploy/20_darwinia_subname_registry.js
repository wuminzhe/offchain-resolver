const { ethers } = require("hardhat");  

module.exports = async ({deployments, network}) => {
    const {deploy} = deployments;

    console.log("\n= Deploying DarwiniaSubnameRegistry on", network.name);

    const {subname_registry_deployer} = await getNamedAccounts();
    console.log("subname_registry_deployer", subname_registry_deployer);

    await deploy('DarwiniaSubnameRegistry', {
        from: subname_registry_deployer,
        log: true,
    });
}
module.exports.tags = ['darwinia'];