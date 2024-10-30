// server/utils/loadContract.js

const { ethers } = require("ethers");
const AccessControlArtifact = require("../path/to/AccessControl.json");

const loadContract = () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL); // or any provider you are using
  const contractAddress = process.env.ACCESS_CONTROL_CONTRACT_ADDRESS; // Add your contract address to .env

  const accessControlContract = new ethers.Contract(contractAddress, AccessControlArtifact.abi, provider);

  return accessControlContract;
};

module.exports = loadContract;
