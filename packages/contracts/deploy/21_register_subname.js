
const { ethers } = require("hardhat");  

module.exports = async ({deployments, network}) => {
    const {deploy} = deployments;

    console.log("\n= Registering subname on", network.name);

    const {subname_registrant} = await getNamedAccounts();

    const darwiniaSubnameRegistry = await ethers.getContract('SubnameRegistry');
    console.log("darwiniaSubnameRegistry", darwiniaSubnameRegistry.address);

    const subname = "bar";
    console.log("Subname to register:", subname);

    // Get the signer for the subname_registrant
    const signer = await ethers.getSigner(subname_registrant);
    console.log("Registered by", signer.address);

    // Connect the contract to the correct signer
    const connectedContract = darwiniaSubnameRegistry.connect(signer);

    // Call the method without specifying 'from'
    const tx = await connectedContract.registerSubname(subname);
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block", receipt.blockNumber);
    console.log("Subname registered successfully!");
};
module.exports.tags = ['darwinia'];


