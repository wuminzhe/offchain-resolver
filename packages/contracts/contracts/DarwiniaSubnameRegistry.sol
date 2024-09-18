// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DarwiniaSubnameRegistry {
    address public owner;
    mapping(bytes32 => address) public subnames;
    mapping(address => string) public addressToSubname;
    string[] public allSubnames;

    bytes32 public constant DARWINIA_NODE = keccak256(
        abi.encodePacked(
            keccak256(abi.encodePacked(bytes32(0), keccak256(abi.encodePacked("eth")))), 
            keccak256(abi.encodePacked("darwinia"))
        )
    );

    event SubnameRegistered(string indexed subname, address indexed owner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event SubnameTransferred(string indexed subname, address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function registerSubname(string calldata subname) public {
        bytes32 node = keccak256(abi.encodePacked(DARWINIA_NODE, keccak256(bytes(subname))));
        require(subnames[node] == address(0), "Subname is already registered");

        subnames[node] = msg.sender;
        addressToSubname[msg.sender] = subname;
        allSubnames.push(subname);  // Add this line
        emit SubnameRegistered(subname, msg.sender);
    }

    function getSubnameForAddress(address addr) public view returns (string memory) {
        return addressToSubname[addr];
    }

    function getSubnameOwner(string calldata subname) public view returns (address) {
        bytes32 node = keccak256(abi.encodePacked(DARWINIA_NODE, keccak256(bytes(subname))));
        return subnames[node];
    }

    function transferOwnership(address newOwner) public onlyOwner {
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function transferSubname(string calldata subname, address newOwner) public {
        bytes32 node = keccak256(abi.encodePacked(DARWINIA_NODE, keccak256(bytes(subname))));
        require(subnames[node] == msg.sender || msg.sender == owner, "Only the subname owner or admin can transfer");
        address previousOwner = subnames[node];
        subnames[node] = newOwner;
        emit SubnameTransferred(subname, previousOwner, newOwner);
    }

    function getAllSubnames() public view returns (string[] memory) {
        return allSubnames;
    }

    function getSubnameCount() public view returns (uint256) {
        return allSubnames.length;
    }
}