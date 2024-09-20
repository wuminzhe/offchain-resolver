const SubnameRegistry = await ethers.getContractFactory("SubnameRegistry");
const subnameRegistry = await SubnameRegistry.deploy("ringdao");
await subnameRegistry.deployed();