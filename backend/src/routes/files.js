const express = require('express');
const multer = require('multer');
const { uploadFileToPinata, retrieveFileFromPinata } = require('../utils/pinata');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/files/upload
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const result = await uploadFileToPinata(req.file);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('API Upload Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/files/:cid
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const data = await retrieveFileFromPinata(cid);
        // This part needs adjustment depending on how you want to serve the file
        // For now, let's assume it returns a readable stream or buffer
        res.json({ success: true, message: "Data retrieval initiated", data });
    } catch (error) {
        console.error('API Retrieval Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
