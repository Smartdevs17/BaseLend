// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LiquidationLogic {
    function calculateLiquidationAmount(
        uint256 debt,
        uint256 collateral,
        uint256 liquidationBonus
    ) internal pure returns (uint256) {
        // Mock calculation
        if (collateral == 0) return 0;
        return (debt * (10000 + liquidationBonus)) / 10000;
    }
}
