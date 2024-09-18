const { ethers } = require("hardhat");

// To deploy to mainnet, run:
// npx hardhat deploy --network mainnet --tags mainnet
module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer, signer} = await getNamedAccounts();
    if(!network.config.gatewayurl){
        throw("gatewayurl is missing on hardhat.config.js");
    }

    console.log("\n= Deploying OffchainResolver");

    console.log("gatewayurl", network.config.gatewayurl);

    await deploy('OffchainResolver', {
        from: deployer,
        args: [network.config.gatewayurl, [signer]],
        log: true,
    });
};
module.exports.tags = ['test', 'demo', 'mainnet'];
