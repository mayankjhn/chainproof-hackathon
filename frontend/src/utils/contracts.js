import { ethers } from 'ethers';
import FileRegistryABI from '../contracts/FileRegistry.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

export const setupContract = (signer) => {
    return new ethers.Contract(CONTRACT_ADDRESS, FileRegistryABI, signer);
};

export const registerFile = async (contract, fileHash, cid, fileName, fileSize, mimeType) => {
    const tx = await contract.registerFile(fileHash, cid, fileName, fileSize, mimeType);
    return await tx.wait();
};

export const verifyFileOnChain = async (contract, fileHash) => {
    try {
        const [exists, isActive] = await contract.verifyFile(fileHash);
        
        if (exists) {
            const fileData = await contract.getFile(fileHash);
            return {
                exists: true,
                isActive,
                fileData: {
                    cid: fileData.cid,
                    timestamp: fileData.timestamp.toNumber(),
                    owner: fileData.owner,
                    fileName: fileData.fileName,
                    fileSize: fileData.fileSize.toNumber(),
                    mimeType: fileData.mimeType,
                    isActive: fileData.isActive
                }
            };
        }
        
        return { exists: false, isActive: false };
        
    } catch (error) {
        console.error('Blockchain verification error:', error);
        throw error;
    }
};

export const getOwnerFiles = async (contract, ownerAddress) => {
    const fileHashes = await contract.getOwnerFiles(ownerAddress);
    const files = [];
    
    for (const hash of fileHashes) {
        const fileData = await contract.getFile(hash);
        files.push({
            hash,
            ...fileData
        });
    }
    
    return files;
};
