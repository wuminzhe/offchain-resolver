const { ethers } = require("hardhat");  

module.exports = async ({deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const owner = deployer;
    const registry = await ethers.getContract('ENSRegistry');
    const resolver = await ethers.getContract('OffchainResolver');

    console.log("\n= Setting resolver for ringdao.eth");

    console.log('ENS Registry address:', registry.address);

    await registry.setSubnodeOwner("0x0000000000000000000000000000000000000000000000000000000000000000", ethers.utils.id('eth'), owner, {from: owner});
    await registry.setSubnodeOwner(ethers.utils.namehash('eth'), ethers.utils.id('ringdao'), owner, {from: owner});

    await registry.setResolver(ethers.utils.namehash('ringdao.eth'), resolver.address, {from: owner});

    // Verify setup
    const resolverAddress = await registry.resolver(ethers.utils.namehash('ringdao.eth'));
    console.log('Resolver for ringdao.eth:', resolverAddress);

    const ownerAddress = await registry.owner(ethers.utils.namehash('ringdao.eth'));
    console.log('Owner of ringdao.eth:', ownerAddress);
};
module.exports.tags = ['test'];
