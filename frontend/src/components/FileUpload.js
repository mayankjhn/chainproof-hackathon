import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FileUpload.css';

// This is the final, definitive version of your FileUpload component.
function FileUpload({ contract, account, isUploader }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, disabled: !isUploader || uploading });

    const handleRegister = async () => {
        if (!file || !contract) return;
        setUploading(true);
        setMessage('1/3: Sending file to server...');
        setError('');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('http://localhost:3001/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            
            setMessage('2/3: Data received. Preparing for blockchain...');
            
            const { ipfsHash, fileName, timestamp } = response.data;

            // --- FINAL BRUTE FORCE TYPE CASTING ---
            // This ensures every variable is the exact type the contract expects, leaving no room for error.
            const finalIpfsHash = String(ipfsHash);
            const finalFileName = String(fileName);
            const finalFileSize = Number(file.size);
            const finalFileType = String(file.type);
            const finalTimestamp = Number(Math.floor(new Date(timestamp).getTime() / 1000));
            
            // This call now uses the explicitly typed variables.
            const tx = await contract.registerFile(
                finalIpfsHash,
                finalFileName,
                finalFileSize,
                finalFileType,
                finalTimestamp
            );
            
            setMessage('3/3: Transaction sent! Waiting for confirmation...');
            await tx.wait();
            setMessage('Success! File is registered on the blockchain.');
            setFile(null);
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.reason || err.message;
            console.error("Full Registration Error Object:", err);
            setError(`Failed to register file. Error: ${errorMessage}`);
            setMessage('');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="file-action-panel">
            <h2>Register a New File</h2>
            <div {...getRootProps({ className: `dropzone ${isDragActive ? 'active' : ''} ${!isUploader ? 'disabled' : ''}` })}>
                <input {...getInputProps()} />
                { !isUploader ? (<p>You do not have permission to upload files.</p>) : file ? (<p>Selected file: <strong>{file.name}</strong></p>) : (<p>Drop files here or click to browse</p>) }
            </div>
            {file && isUploader && (<button onClick={handleRegister} disabled={uploading}>{uploading ? 'Registering...' : 'Register File on Blockchain'}</button>)}
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
        </div>
    );
}

export default FileUpload;
