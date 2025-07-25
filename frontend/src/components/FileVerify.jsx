import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FileVerify.css'; // We'll add this file for styling

// This is the final, fully functional component for verifying files.
function FileVerify({ contract }) {
    const [file, setFile] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setVerificationResult(null); // Reset previous result
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        disabled: verifying,
    });

    const handleVerify = async () => {
        if (!file || !contract) return;

        setVerifying(true);
        setVerificationResult({ status: 'info', message: 'Getting IPFS hash from server...' });

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Step 1: Send the file to the backend to get its canonical IPFS hash.
            // Pinata will recognize it as a duplicate and just return the hash.
            const response = await axios.post('http://localhost:3001/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const { ipfsHash } = response.data;
            setVerificationResult({ status: 'info', message: `Hash found: ${ipfsHash.substring(0,10)}... Checking blockchain...` });

            // Step 2: Call the correct getFile function on the smart contract.
            const fileRecord = await contract.getFile(ipfsHash);
            
            // Step 3: Check if the file has a valid registrant.
            // The zero address means the file was not found.
            if (fileRecord.registrant !== '0x0000000000000000000000000000000000000000') {
                setVerificationResult({
                    status: 'success',
                    message: `✅ File Verified!`,
                    record: {
                        ...fileRecord,
                        timestamp: new Date(fileRecord.timestamp.toNumber() * 1000).toLocaleString()
                    }
                });
            } else {
                setVerificationResult({
                    status: 'error',
                    message: '✗ Verification Failed: This file is not registered on the blockchain.'
                });
            }

        } catch (err) {
            console.error("Verification Error:", err);
            setVerificationResult({ status: 'error', message: 'An error occurred during verification.' });
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="file-action-panel">
            <h2>Verify File Integrity</h2>
            <div {...getRootProps({ className: `dropzone ${isDragActive ? 'active' : ''}` })}>
                <input {...getInputProps()} />
                <p>Drop a file here to verify its integrity</p>
            </div>
            {file && (
                <button onClick={handleVerify} disabled={verifying}>
                    {verifying ? 'Verifying...' : 'Verify File'}
                </button>
            )}
            {verificationResult && (
                <div className={`message ${verificationResult.status}`}>
                    <p>{verificationResult.message}</p>
                    {verificationResult.record && (
                        <div className="verification-details">
                            <p><strong>File Name:</strong> {verificationResult.record.fileName}</p>
                            <p><strong>Registered By:</strong> {verificationResult.record.registrant}</p>
                            <p><strong>Timestamp:</strong> {verificationResult.record.timestamp}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default FileVerify;
