import React, { useState, useEffect } from 'react';

// This is the final, simplified, and robust version of the AuditTrail component.
function AuditTrail({ contract }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (!contract) return;

        // This function will be called whenever a new 'FileRegistered' event is detected on the blockchain.
        const listener = (ipfsHash, fileName, fileSize, fileType, timestamp, registrant, event) => {
            const newEvent = {
                txHash: event.transactionHash,
                ipfsHash,
                fileName,
                fileSize: fileSize.toString(),
                fileType,
                timestamp: new Date(timestamp.toNumber() * 1000).toLocaleString(),
                registrant
            };
            // Add the new event to the top of our list in real-time.
            setEvents(prevEvents => [newEvent, ...prevEvents]);
        };

        // Start listening for new events.
        contract.on('FileRegistered', listener);

        // This is a cleanup function. When you leave the page, it stops listening for new events.
        return () => {
            contract.off('FileRegistered', listener);
        };

    }, [contract]); // This effect runs only when the contract is ready.

    return (
        <div className="audit-trail-container">
            <h2>Live Audit Trail</h2>
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>File Name</th>
                        <th>File Size (Bytes)</th>
                        <th>IPFS Hash</th>
                        <th>Registered By</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <tr key={index}>
                                <td>{event.timestamp}</td>
                                <td>{event.fileName}</td>
                                <td>{event.fileSize}</td>
                                <td><a href={`https://ipfs.io/ipfs/${event.ipfsHash}`} target="_blank" rel="noopener noreferrer">{`${event.ipfsHash.substring(0, 6)}...`}</a></td>
                                <td>{`${event.registrant.substring(0, 6)}...`}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No files have been registered yet in this session. Register a file to see it appear here.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AuditTrail;
