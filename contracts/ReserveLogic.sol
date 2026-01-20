// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReserveLogic
 * @dev Library for lending pool reserve calculations
 */
library ReserveLogic {
    
    uint256 constant SECONDS_PER_YEAR = 31536000;
    
    function calculateCompoundedInterest(
        uint256 rate,
        uint256 lastUpdateTimestamp
    ) internal view returns (uint256) {
        uint256 timeDelta = block.timestamp - lastUpdateTimestamp;
        // Simple linear approximation for gas efficiency in this MVP
        // Real implementation uses binomial expansion or wad ray math
        if (timeDelta == 0) return 1e18; // 1.0 in ray
        
        uint256 linearInterest = 1e18 + (rate * timeDelta);
        return linearInterest;
    }
    
    function calculateUtilizationRate(
        uint256 totalDebt,
        uint256 totalLiquidity
    ) internal pure returns (uint256) {
        if (totalLiquidity == 0) return 0;
        return (totalDebt * 10000) / totalLiquidity;
    }
}
