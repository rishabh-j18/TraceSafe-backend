// src/controllers/roleController.js
const { contract, web3 } = require('../services/web3');

const addUser = async (req, res) => {
    const { account } = req.body;
    const adminAddress = req.user.walletAddress; // Assuming you store user's wallet address in the session or JWT token

    try {
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods.addUser(account).estimateGas({ from: adminAddress });

        const result = await contract.methods.addUser(account).send({ from: adminAddress, gas: gasEstimate, gasPrice });
        res.json({ success: true, transaction: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const removeUser = async (req, res) => {
    const { account } = req.body;
    const adminAddress = req.user.walletAddress;

    try {
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods.removeUser(account).estimateGas({ from: adminAddress });

        const result = await contract.methods.removeUser(account).send({ from: adminAddress, gas: gasEstimate, gasPrice });
        res.json({ success: true, transaction: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const isUser = async (req, res) => {
    const { account } = req.body;

    try {
        const result = await contract.methods.isUser(account).call();
        res.json({ success: true, isUser: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addUser, removeUser, isUser };
