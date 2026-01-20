// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DebtToken.sol";

contract StableDebtToken is DebtToken {
    constructor() DebtToken("Stable Debt", "SDEBT") {}
    
    function mintStable(address user, uint256 amount, uint256 rate) external onlyOwner {
        _mint(user, amount);
        // Store rate logic stub
    }
}
