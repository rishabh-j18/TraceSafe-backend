module.exports = {
  networks: {
    ganache: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Ganache default port
      network_id: "*",       // Match any network ID
      gas: 6721975,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",     // Specify the Solidity compiler version
    },
  },
};
