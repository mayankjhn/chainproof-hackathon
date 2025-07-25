// This is the final, corrected deployment script.

const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log(
    "Deploying contracts with account:",
    deployer.address
  );
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  const FileRegistryFactory = await hre.ethers.getContractFactory("FileRegistry");
  
  // --- THE FINAL FIX IS HERE ---
  // We are now calling .deploy() with no arguments, which matches the contract's constructor.
  const fileRegistry = await FileRegistryFactory.deploy();
  // --- END OF FIX ---
  
  await fileRegistry.deployed();

  console.log("FileRegistry deployed to:", fileRegistry.address);
  console.log("Transaction hash:", fileRegistry.deployTransaction.hash);

  // --- Save deployment information ---
  const deploymentInfo = {
    amoy: {
      FileRegistry: {
        address: fileRegistry.address,
        transactionHash: fileRegistry.deployTransaction.hash,
        deployer: deployer.address,
        timestamp: new Date().toISOString()
      }
    }
  };
  fs.writeFileSync('./deployments/amoy.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to: ./deployments/amoy.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
