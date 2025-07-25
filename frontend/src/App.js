import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FileRegistryABI from './contracts/FileRegistry.json';

import WalletConnect from './components/WalletConnect';
import FileUpload from './components/FileUpload';
import FileVerify from './components/FileVerify';
import AuditTrail from './components/AuditTrail';
import './App.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [isUploader, setIsUploader] = useState(false);
    const [network, setNetwork] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await newProvider.send("eth_requestAccounts", []);
                const newSigner = newProvider.getSigner();
                const networkInfo = await newProvider.getNetwork();

                // This logic is already correct for handling the network name
                if (networkInfo.chainId === 80002) {
                    networkInfo.name = "Polygon Amoy";
                }

                setAccount(accounts[0]);
                setNetwork(networkInfo);

                const fileRegistryContract = new ethers.Contract(CONTRACT_ADDRESS, FileRegistryABI.abi, newSigner);
                setContract(fileRegistryContract);
                
                // Bypassing role check for the demo
                console.log("Bypassing role check. Assuming user is Admin & Uploader for testing.");
                setIsUploader(true);

            } catch (error) {
                console.error("Error connecting wallet:", error);
                alert("Failed to connect wallet. See console for details.");
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this dApp.");
        }
    };

    useEffect(() => {
        if (window.ethereum && window.ethereum.selectedAddress) {
            connectWallet();
        }
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => connectWallet());
        }
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <div className="header-title">
                    <h1>ChainProof 🛡️</h1>
                    {/* Your team name is now professionally integrated here */}
                    <p className="team-subtitle">Decentralized File Integrity Verification System</p>
                </div>
                <WalletConnect account={account} network={network} connectWallet={connectWallet} />
            </header>

            <main>
                {account && contract ? (
                    <>
                        <div className="action-panels">
                            {/* The component names are the same, but they will use the new CSS */}
                            <FileUpload account={account} contract={contract} isUploader={isUploader} className="file-action-panel" />
                            <FileVerify contract={contract} className="file-action-panel" />
                        </div>
                        <AuditTrail contract={contract} />
                    </>
                ) : (
                    <div className="connect-prompt">
                        <h2>Please connect your wallet to begin.</h2>
                        <button className="connect-button" onClick={connectWallet}>Connect Wallet</button>
                    </div>
                )}
            </main>
            
            <footer>
                <p>Project By Team Rooted</p>
            </footer>
        </div>
    );
}

export default App;
