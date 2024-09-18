const { ethers } = require("hardhat");  
module.exports = async ({deployments}) => {
    const {deploy} = deployments;
    const signers = await ethers.getSigners();
    const owner = signers[0].address;
    const registry = await ethers.getContract('ENSRegistry');
    const resolver = await ethers.getContract('OffchainResolver');
    console.log('ENS Registry address:', registry.address);
    console.log('OffchainResolver address:', resolver.address);

    await registry.setSubnodeOwner("0x0000000000000000000000000000000000000000000000000000000000000000", ethers.utils.id('eth'), owner, {from: owner});
    console.log('Set owner for .eth');

    await registry.setSubnodeOwner(ethers.utils.namehash('eth'), ethers.utils.id('darwinia'), owner, {from: owner});
    console.log('Set owner for darwinia.eth');

    await registry.setResolver(ethers.utils.namehash('darwinia.eth'), resolver.address, {from: owner});
    console.log('Set resolver for darwinia.eth');

    // Verify setup
    const resolverAddress = await registry.resolver(ethers.utils.namehash('darwinia.eth'));
    console.log('Resolver for darwinia.eth:', resolverAddress);

    const ownerAddress = await registry.owner(ethers.utils.namehash('darwinia.eth'));
    console.log('Owner of darwinia.eth:', ownerAddress);
};
module.exports.tags = ['test'];
