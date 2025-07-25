import React from 'react';

// This helper function translates the Chain ID into a readable name.
// It will always work, regardless of what MetaMask reports.
const getNetworkLabel = (chainId) => {
    switch (chainId) {
        case 1:
            return "Ethereum Mainnet";
        case 137:
            return "Polygon Mainnet";
        case 80002:
            return "Polygon Amoy"; // The correct name for ChainID 80002
        default:
            return `Unknown (ID: ${chainId})`;
    }
};

function WalletConnect({ account, network, connectWallet }) {
    return (
        <div className="wallet-connector">
            {account && network ? (
                <>
                    {/* This span will now correctly display the network name */}
                    <span style={{ color: '#4caf50', fontWeight: 'bold', marginRight: '10px' }}>
                        {getNetworkLabel(network.chainId)}
                    </span>
                    {/* This uses the 'address' class from your existing CSS */}
                    <span className="address">
                        {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                    </span>
                </>
            ) : (
                <button className="connect-button" onClick={connectWallet}>
                    Connect Wallet
                </button>
            )}
        </div>
    );
}

export default WalletConnect;
