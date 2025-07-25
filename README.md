# ChainProof 🛡️
### A Project by Team Rooted

---

## 1. The Problem
In today’s digital world, ensuring the integrity and authenticity of shared files is a major challenge. Data can be tampered with during transit or storage, leading to security breaches and a loss of trust. This is especially critical in legal, financial, and healthcare sectors where the authenticity of documents is paramount. How can we be certain that a file we receive is the exact same one that was originally sent?

## 2. Our Solution: ChainProof
**ChainProof** is a full-stack decentralized application that solves this problem by leveraging the power of blockchain technology. It provides a secure, transparent, and tamper-proof system for uploading and verifying files, acting as a "Digital Notary" for the modern age.

Our system works in three simple steps:
1.  **Register:** A file is given a unique, unbreakable cryptographic fingerprint (an IPFS hash) based on its content. This fingerprint is mathematically guaranteed to be unique to that specific version of the file.
2.  **Record:** This unique fingerprint, along with metadata like the file name and timestamp, is permanently recorded on the Polygon blockchain via a custom smart contract. This creates an immutable, verifiable, and globally accessible audit trail.
3.  **Verify:** Anyone can later verify a file's integrity. The system re-calculates the file's fingerprint and confirms if it matches the official record on the blockchain. A successful match guarantees the file is authentic and unchanged. A mismatch instantly proves it has been tampered with or is a forgery.

---

## 3. High-Level Architecture
Our application is built on a robust, decentralized architecture that separates concerns for maximum security and scalability.

*   **Frontend (React.js):** The user-facing interface where users can register and verify files. It communicates with MetaMask for wallet interactions and directly with our smart contract on the blockchain.
*   **Backend (Node.js/Express.js):** A lightweight server whose sole responsibility is to communicate with the Pinata service to upload files to the InterPlanetary File System (IPFS).
*   **Smart Contract (Solidity):** The immutable "rulebook" deployed on the Polygon Amoy testnet. It handles the logic for registering file hashes and retrieving them for verification. It also includes an `AccessControl` feature, allowing only authorized wallets to register new files.
*   **Decentralized Storage (IPFS):** The decentralized network where the files themselves are stored. We use Pinata as a pinning service to ensure the files remain accessible.

---

## 4. Technology Stack
*   **Blockchain:** Polygon (Amoy Testnet)
*   **Smart Contracts:** Solidity, Hardhat, OpenZeppelin Contracts
*   **Frontend:** React.js, Ethers.js
*   **Backend:** Node.js, Express.js
*   **Decentralized Storage:** IPFS (via Pinata)
*   **Wallet Integration:** MetaMask

---

## 5. How to Run This Project Locally

**Prerequisites:**
*   Node.js and npm (v18 or later recommended)
*   MetaMask browser extension installed and configured with the Polygon Amoy testnet

**Step-by-Step Setup:**

1.  **Clone the Repository:**
    ```
    git clone <your-github-repository-url>
    cd chainproof-hackathon
    ```

2.  **Install All Dependencies:**
    This project uses a monorepo structure. You'll need to install dependencies for the root, the backend, and the frontend.
    ```
    # Install root dependencies (for Hardhat)
    npm install

    # Install backend dependencies
    cd backend
    npm install
    cd ..

    # Install frontend dependencies
    cd frontend
    npm install
    cd ..
    ```

3.  **Configure Environment Variables:**
    You will need to create three `.env` files.

    *   **In the root folder (`/`):** Create a file named `.env` for your Hardhat deployment.
        ```
        AMOY_RPC_URL="<Your_Amoy_RPC_URL_from_Alchemy_or_Infura>"
        PRIVATE_KEY="<Your_Deployer_Wallet_Private_Key>"
        POLYGONSCAN_API_KEY="<Your_Polygonscan_API_Key>"
        ```

    *   **In the `backend/` folder:** Create a `.env` file for your Pinata API keys.
        ```
        PINATA_JWT="<Your_Pinata_JWT_API_Key>"
        ```

    *   **In the `frontend/` folder:** Create a `.env` file with the address of your deployed smart contract.
        ```
        REACT_APP_CONTRACT_ADDRESS="<Your_Deployed_FileRegistry_Contract_Address>"
        ```

4.  **Deploy the Smart Contract (Optional, if you want a fresh deployment):**
    ```
    npx hardhat compile
    npx hardhat run scripts/deploy.js --network amoy
    ```
    *Remember to update `REACT_APP_CONTRACT_ADDRESS` in the frontend `.env` file with the new address.*

5.  **Run the Application:**
    You will need two separate terminals.

    *   **Terminal 1: Start the Backend Server**
        ```
        cd backend
        npm start
        ```

    *   **Terminal 2: Start the Frontend Server**
        ```
        cd frontend
        npm start
        ```

The application will now be running at `http://localhost:3000`.

---

## 6. Our Team (Team Rooted)
*   **Mayank Agarwal** - Project Lead & Full-Stack Developer
*   **Vinayak Tripathi** - Backend & API Support
*   **Himanshu Kesarwani** - Frontend Specialist

