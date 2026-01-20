// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DataTypes.sol";
import "./ReserveConfiguration.sol";

library ValidationLogic {
    using ReserveConfiguration for DataTypes.ReserveConfigurationMap;

    function validateDeposit(
        DataTypes.ReserveData memory reserve,
        uint256 amount
    ) internal pure {
        require(amount > 0, "Amount must be > 0");
        require(reserve.configuration.getActive(), "Reserve not active");
        require(!reserve.configuration.getFrozen(), "Reserve frozen");
    }
}
