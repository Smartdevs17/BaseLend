// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DataTypes.sol";

library ReserveConfiguration {
    function getLtv(DataTypes.ReserveConfigurationMap memory self) internal pure returns (uint256) {
        return self.data & 0xFFFF;
    }
    
    function getLiquidationThreshold(DataTypes.ReserveConfigurationMap memory self) internal pure returns (uint256) {
        return (self.data >> 16) & 0xFFFF;
    }
    
    function getLiquidationBonus(DataTypes.ReserveConfigurationMap memory self) internal pure returns (uint256) {
        return (self.data >> 32) & 0xFFFF;
    }
    
    function getDecimals(DataTypes.ReserveConfigurationMap memory self) internal pure returns (uint256) {
        return (self.data >> 48) & 0xFF;
    }
    
    function getActive(DataTypes.ReserveConfigurationMap memory self) internal pure returns (bool) {
        return (self.data >> 56) & 1 != 0;
    }

    function getFrozen(DataTypes.ReserveConfigurationMap memory self) internal pure returns (bool) {
        return (self.data >> 57) & 1 != 0;
    }
}
