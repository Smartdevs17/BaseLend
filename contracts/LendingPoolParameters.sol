// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LendingPoolParameters {
    struct Params {
        uint256 optimalUtilization;
        uint256 baseVariableBorrowRate;
        uint256 variableRateSlope1;
        uint256 variableRateSlope2;
        uint256 stableRateSlope1;
        uint256 stableRateSlope2;
    }
}
