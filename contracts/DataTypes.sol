// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library DataTypes {
    struct UserConfigurationMap {
        uint256 data;
    }

    struct ReserveConfigurationMap {
        uint256 data;
    }
    
    struct ReserveData {
        ReserveConfigurationMap configuration;
        uint128 liquidityIndex;
        uint128 variableBorrowIndex;
        uint128 currentLiquidityRate;
        uint128 currentVariableBorrowRate;
        uint128 currentStableBorrowRate;
        uint40 lastUpdateTimestamp;
        address aTokenAddress;
        address stableDebtTokenAddress;
        address variableDebtTokenAddress;
        address interestRateStrategyAddress;
        uint8 id;
    }
}
