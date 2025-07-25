// This is the final, definitive version of your backend/server.js file

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    try {
        console.log("File received by backend. Uploading to Pinata...");

        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);
        formData.append('pinataMetadata', JSON.stringify({ name: req.file.originalname }));
        formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

        const pinataResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: `Bearer ${process.env.PINATA_JWT}`
            }
        });

        // --- BACKEND DEBUGGING LOG ---
        // This log will prove what the backend received from Pinata.
        const ipfsHashFromPinata = pinataResponse.data.IpfsHash;
        console.log("--- BACKEND DEBUG ---");
        console.log(`Received from Pinata: IpfsHash = ${ipfsHashFromPinata}`);
        
        if (!ipfsHashFromPinata) {
            throw new Error("Pinata API response did not contain an IpfsHash.");
        }
        
        // This is the data we are sending to the frontend.
        const responseData = {
            ipfsHash: ipfsHashFromPinata,
            fileName: req.file.originalname,
            timestamp: pinataResponse.data.Timestamp
        };

        console.log("Sending to frontend:", responseData);
        console.log("---------------------");

        res.status(200).json(responseData);

    } catch (error) {
        const errorMessage = error.response ? (error.response.data.error || error.response.data) : error.message;
        console.error("Backend Error:", errorMessage);
        res.status(500).json({ error: `Backend failed: ${errorMessage}` });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
