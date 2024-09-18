const { ethers } = require("hardhat");  

module.exports = async ({deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const owner = deployer;
    const registry = await ethers.getContract('ENSRegistry');
    const resolver = await ethers.getContract('OffchainResolver');

    console.log("\n= Setting resolver for darwinia.eth");

    console.log('ENS Registry address:', registry.address);

    await registry.setSubnodeOwner("0x0000000000000000000000000000000000000000000000000000000000000000", ethers.utils.id('eth'), owner, {from: owner});
    await registry.setSubnodeOwner(ethers.utils.namehash('eth'), ethers.utils.id('darwinia'), owner, {from: owner});

    await registry.setResolver(ethers.utils.namehash('darwinia.eth'), resolver.address, {from: owner});

    // Verify setup
    const resolverAddress = await registry.resolver(ethers.utils.namehash('darwinia.eth'));
    console.log('Resolver for darwinia.eth:', resolverAddress);

    const ownerAddress = await registry.owner(ethers.utils.namehash('darwinia.eth'));
    console.log('Owner of darwinia.eth:', ownerAddress);
};
module.exports.tags = ['test'];
