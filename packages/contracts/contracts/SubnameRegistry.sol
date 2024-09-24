// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract SubnameRegistry is ERC721, ERC721Enumerable {
    using Counters for Counters.Counter;

    bytes32 public immutable BASE_NODE;
    address public owner;

    // Mapping from subname node to tokenId. 
    // subname node: keccak256(abi.encodePacked(BASE_NODE, keccak256(bytes(subname))))
    mapping(bytes32 => uint256) public subnameToTokenId;
    // Mapping from tokenId to subname
    mapping(uint256 => string) public tokenIdToSubname;
    Counters.Counter private _tokenIds;

    // Mapping to store commitment hashes
    mapping(bytes32 => uint256) public commitments;

    // Commitment time window
    uint256 public constant MIN_COMMITMENT_AGE = 1 minutes;
    uint256 public constant MAX_COMMITMENT_AGE = 24 hours;

    uint256 public registrationFee;

    event SubnameRegistered(string indexed subname, address indexed owner, uint256 tokenId);
    event SubnameTransferred(string indexed subname, address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(string memory baseName, uint256 initialFee) ERC721(baseName, "SUB") {
        owner = msg.sender;
        BASE_NODE = keccak256(
            abi.encodePacked(
                keccak256(abi.encodePacked(bytes32(0), keccak256(abi.encodePacked("eth")))), 
                keccak256(abi.encodePacked(baseName))
            )
        );
        registrationFee = initialFee;
        emit OwnershipTransferred(address(0), owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function valid(string memory name) public pure returns (bool) {
        return _strlen(name) >= 3;
    }

    function commit(bytes32 commitment) public {
        require(commitments[commitment] + MAX_COMMITMENT_AGE >= block.timestamp, "Unexpired commitment exists");
        commitments[commitment] = block.timestamp;
    }

    function registerSubname(string calldata subname, bytes32 secret) public payable {
        require(msg.value >= registrationFee, "Insufficient fee");
        
        bytes32 commitment = keccak256(abi.encodePacked(subname, msg.sender, secret));
        _consumeCommitment(subname, commitment);

        bytes32 subnameNode = keccak256(abi.encodePacked(BASE_NODE, keccak256(bytes(subname))));
        require(subnameToTokenId[subnameNode] == 0, "Subname is already registered");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        subnameToTokenId[subnameNode] = newTokenId;
        tokenIdToSubname[newTokenId] = subname;

        _safeMint(msg.sender, newTokenId);

        emit SubnameRegistered(subname, msg.sender, newTokenId);
    }

    function _consumeCommitment(
        string memory subname,
        bytes32 commitment
    ) internal {
        require(commitments[commitment] != 0, "Commitment doesn't exist");
        require(block.timestamp >= commitments[commitment] + MIN_COMMITMENT_AGE, "CommitmentTooNew");
        require(block.timestamp <= commitments[commitment] + MAX_COMMITMENT_AGE, "CommitmentTooOld");
        require(valid(subname), "Not a valid subname");

        delete (commitments[commitment]);
    }

    function getSubnameOwner(string calldata subname) public view returns (address) {
        bytes32 subnameNode = keccak256(abi.encodePacked(BASE_NODE, keccak256(bytes(subname))));
        uint256 tokenId = subnameToTokenId[subnameNode];
        require(_exists(tokenId), "Subname not registered");
        return ownerOf(tokenId);
    }

    function getSubnameForAddress(address addr) public view returns (string memory) {
        require(balanceOf(addr) > 0, "Address does not own a subname");
        uint256 tokenId = tokenOfOwnerByIndex(addr, 0);
        return tokenIdToSubname[tokenId];
    }

    function getSubnameByTokenId(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Subname not registered");
        return tokenIdToSubname[tokenId];
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function transferSubname(string calldata subname, address newOwner) public {
        require(newOwner != address(0), "New owner is the zero address");

        bytes32 subnameNode = keccak256(abi.encodePacked(BASE_NODE, keccak256(bytes(subname))));
        uint256 tokenId = subnameToTokenId[subnameNode];

        require(_exists(tokenId), "Subname not registered");
        require(ownerOf(tokenId) == msg.sender, "Caller is not the owner of the subname");
        require(balanceOf(newOwner) == 0, "New owner already has a subname");

        _transfer(msg.sender, newOwner, tokenId);

        emit SubnameTransferred(subname, msg.sender, newOwner);
    }

    function setRegistrationFee(uint256 newFee) public onlyOwner {
        registrationFee = newFee;
    }

    function withdrawFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns the length of a given string
     *
     * @param s The string to measure the length of
     * @return The length of the input string
     */
    function _strlen(string memory s) internal pure returns (uint256) {
        uint256 len;
        uint256 i = 0;
        uint256 bytelength = bytes(s).length;
        for (len = 0; i < bytelength; len++) {
            bytes1 b = bytes(s)[i];
            if (b < 0x80) {
                i += 1;
            } else if (b < 0xE0) {
                i += 2;
            } else if (b < 0xF0) {
                i += 3;
            } else if (b < 0xF8) {
                i += 4;
            } else if (b < 0xFC) {
                i += 5;
            } else {
                i += 6;
            }
        }
        return len;
    }

}