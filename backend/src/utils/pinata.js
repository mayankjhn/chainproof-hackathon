const pinataSDK = require('@pinata/sdk');
const stream = require('stream');
require('dotenv').config();

// CORRECT INITIALIZATION: Call pinataSDK as a function, not with "new"
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

const uploadFileToPinata = async (file) => {
    try {
        const readableStream = new stream.PassThrough();
        readableStream.end(file.buffer);

        const options = {
            pinataMetadata: {
                name: file.originalname,
            },
        };

        const result = await pinata.pinFileToIPFS(readableStream, options);

        return {
            cid: result.IpfsHash,
            size: result.PinSize,
            timestamp: result.Timestamp
        };
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        throw new Error(`Pinata upload failed: ${error.message}`);
    }
};

const retrieveFileFromPinata = async (cid) => {
    const gatewayUrl = `https://${process.env.PINATA_GATEWAY}/ipfs/${cid}`;
    return { gatewayUrl };
};

module.exports = {
    uploadFileToPinata,
    retrieveFileFromPinata,
};
