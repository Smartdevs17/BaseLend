// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../LiquidationLogic.sol";

contract MockLiquidationLogic {
    function calculateLiquidationAmount(
        uint256 debt,
        uint256 collateral,
        uint256 liquidationBonus
    ) external pure returns (uint256) {
        return LiquidationLogic.calculateLiquidationAmount(debt, collateral, liquidationBonus);
    }
}
