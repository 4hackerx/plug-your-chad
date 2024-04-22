// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Import the ERC20 standard interface
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUsdc is ERC20 {
    // Define a constant for the number of decimals
    uint8 constant DECIMALS = 6;

    // Define a constructor to set the initial token supply
    constructor(uint256 initialSupply) ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, initialSupply * (10 ** DECIMALS)); // Mint initial supply with 6 decimals
    }
}
