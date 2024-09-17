// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DarwiniaSubnameRegistry {
    address public owner;
    mapping(bytes32 => SubnameRecord) public subnames;

    bytes32 public constant DARWINIA_NODE = keccak256(abi.encodePacked(keccak256(abi.encodePacked(bytes32(0), keccak256(abi.encodePacked("eth")))), keccak256(abi.encodePacked("darwinia"))));
    uint256 public constant REGISTRATION_PERIOD = 365 days;
    uint256 public registrationFee = 0.01 ether;

    struct SubnameRecord {
        address owner;
        uint256 expirationTime;
    }

    event SubnameRegistered(string indexed subname, address indexed owner, uint256 expirationTime);
    event SubnameRenewed(string indexed subname, uint256 newExpirationTime);
    event RegistrationFeeChanged(uint256 newFee);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event SubnameTransferred(string indexed subname, address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function registerSubname(string calldata subname) public payable {
        require(msg.value >= registrationFee, "Insufficient registration fee");
        bytes32 node = keccak256(abi.encodePacked(DARWINIA_NODE, keccak256(bytes(subname))));
        require(subnames[node].expirationTime < block.timestamp, "Subname is already registered");

        uint256 expirationTime = block.timestamp + REGISTRATION_PERIOD;
        subnames[node] = SubnameRecord(msg.sender, expirationTime);
        emit SubnameRegistered(subname, msg.sender, expirationTime);
    }

    function renewSubname(string calldata subname) public payable {
        require(msg.value >= registrationFee, "Insufficient renewal fee");
        bytes32 node = keccak256(abi.encodePacked(DARWINIA_NODE, keccak256(bytes(subname))));
        require(subnames[node].owner == msg.sender, "Only the subname owner can renew");

        uint256 newExpirationTime = block.timestamp + REGISTRATION_PERIOD;
        subnames[node].expirationTime = newExpirationTime;
        emit SubnameRenewed(subname, newExpirationTime);
    }

    function getSubnameOwner(string calldata subname) public view returns (address) {
        bytes32 node = keccak256(abi.encodePacked(DARWINIA_NODE, keccak256(bytes(subname))));
        SubnameRecord memory record = subnames[node];
        if (record.expirationTime < block.timestamp) {
            return address(0);
        }
        return record.owner;
    }

    function setRegistrationFee(uint256 newFee) public onlyOwner {
        registrationFee = newFee;
        emit RegistrationFeeChanged(newFee);
    }

    function withdrawFees() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function transferSubname(string calldata subname, address newOwner) public {
        require(newOwner != address(0), "New owner cannot be the zero address");
        bytes32 node = keccak256(abi.encodePacked(DARWINIA_NODE, keccak256(bytes(subname))));
        require(subnames[node].owner == msg.sender, "Only the subname owner can transfer");
        require(subnames[node].expirationTime > block.timestamp, "Subname has expired");

        subnames[node].owner = newOwner;
        emit SubnameTransferred(subname, msg.sender, newOwner);
    }
}