const { ethers } = require("hardhat");

module.exports = async ({deployments}) => {
    const {deploy} = deployments;

    console.log("\n= Deploying ENSRegistry");

    const {deployer} = await getNamedAccounts();
    await deploy('ENSRegistry', {
        from: deployer,
        args: [],
        log: true,
    });
};
module.exports.tags = ['test'];
