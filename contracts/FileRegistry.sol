// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract FileRegistry is AccessControl {
    
    // --- THE FINAL FIX IS HERE ---
    // The ipfsHash is now correctly defined as a 'string' to hold the full hash.
    struct File {
        string ipfsHash;
        string fileName;
        uint256 fileSize;
        string fileType;
        uint256 timestamp;
        address registrant;
    }
    // --- END OF FIX ---

    mapping(string => File) private _files;
    string[] private _allFileHashes;

    bytes32 public constant UPLOADER_ROLE = keccak256("UPLOADER_ROLE");
    
    event FileRegistered(
        string ipfsHash,
        string fileName,
        uint256 fileSize,
        string fileType,
        uint256 timestamp,
        address registrant
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPLOADER_ROLE, msg.sender);
    }
    
    // --- THE FINAL FIX IS HERE ---
    // The registerFile function now correctly accepts 'string' for the ipfsHash.
    function registerFile(
        string memory ipfsHash,
        string memory fileName,
        uint256 fileSize,
        string memory fileType,
        uint256 timestamp
    ) public onlyRole(UPLOADER_ROLE) {
        require(bytes(_files[ipfsHash].ipfsHash).length == 0, "File already registered.");

        _files[ipfsHash] = File(
            ipfsHash,
            fileName,
            fileSize,
            fileType,
            timestamp,
            msg.sender
        );
        _allFileHashes.push(ipfsHash);

        emit FileRegistered(
            ipfsHash,
            fileName,
            fileSize,
            fileType,
            timestamp,
            msg.sender
        );
    }
    // --- END OF FIX ---

    function getFile(string memory ipfsHash) public view returns (File memory) {
        return _files[ipfsHash];
    }
    
    function getAllFiles() public view returns (File[] memory) {
        File[] memory allFiles = new File[](_allFileHashes.length);
        for (uint i = 0; i < _allFileHashes.length; i++) {
            allFiles[i] = _files[_allFileHashes[i]];
        }
        return allFiles;
    }
}
