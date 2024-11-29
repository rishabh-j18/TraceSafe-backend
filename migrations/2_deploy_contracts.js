const MissingPersonRegistry = artifacts.require("MissingPersonRegistry");

module.exports = function (deployer) {
  deployer.deploy(MissingPersonRegistry);
};
