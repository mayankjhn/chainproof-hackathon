import { PinataSDK } from "pinata";

// Initialize the Pinata SDK with your credentials from the .env file
const pinata = new PinataSDK({
    pinataJwt: process.env.REACT_APP_PINATA_JWT,
    pinataGateway: process.env.REACT_APP_PINATA_GATEWAY
});

/**
 * Uploads a file to IPFS using the Pinata SDK.
 * @param {File} file The file to upload.
 * @returns {Promise<object>} An object containing the CID, size, and timestamp.
 */
export const uploadToIPFS = async (file) => {
    try {
        // The new SDK has a direct upload method
        const uploadResult = await pinata.upload.public.file(file);

        if (!uploadResult.cid) {
            throw new Error("Failed to get CID from Pinata response.");
        }

        return {
            cid: uploadResult.cid,
            size: uploadResult.size,
            timestamp: uploadResult.created_at
        };
    } catch (error) {
        console.error('IPFS upload error:', error);
        throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }
};

/**
 * Constructs the URL to retrieve a file from the Pinata gateway.
 * @param {string} cid The IPFS Content Identifier.
 * @returns {string} The full URL to the file on the IPFS gateway.
 */
export const getFromIPFS = (cid) => {
    if (!process.env.REACT_APP_PINATA_GATEWAY || !cid) {
        return '';
    }
    return `https://${process.env.REACT_APP_PINATA_GATEWAY}/ipfs/${cid}`;
};
