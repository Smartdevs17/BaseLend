// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LiquidationLogic
 * @notice Implements the logic for calculating liquidation amounts
 */
library LiquidationLogic {
    /**
     * @notice Calculates the max amount (debt + bonus) a liquidator can seize
     * @param debt The total debt amount to be covered
     * @param collateral The available collateral of the borrower
     * @param liquidationBonus The bonus percentage in basis points (e.g. 500 = 5%)
     * @return The maximum collateral amount to be liquidated
     */
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
