// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DebtToken.sol";

contract VariableDebtToken is DebtToken {
    constructor() DebtToken("Variable Debt", "VDEBT") {}
    
    function mintVariable(address user, uint256 amount, uint256 index) external onlyOwner {
        _mint(user, amount);
        // Store index logic stub
    }
}
