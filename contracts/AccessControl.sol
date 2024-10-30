// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AccessControlExample is AccessControl {
    // Define role identifiers
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    constructor() {
        // Grant the contract deployer the admin role
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    // Modifier to check if the caller has the admin role
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "AccessControl: Caller is not an admin");
        _;
    }

    // Function to add a new user
    function addUser(address account) public onlyAdmin {
        grantRole(USER_ROLE, account);
    }

    // Function to remove a user
    function removeUser(address account) public onlyAdmin {
        revokeRole(USER_ROLE, account);
    }

    // Function to check if an address has the user role
    function isUser(address account) public view returns (bool) {
        return hasRole(USER_ROLE, account);
    }

    // Function to get the admin role
    function isAdmin(address account) public view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }
}
