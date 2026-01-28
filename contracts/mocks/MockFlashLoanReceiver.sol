// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IFlashLoanReceiver {
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

contract MockFlashLoanReceiver is IFlashLoanReceiver {
    
    bool public failExecution;
    bool public failRepayment;
    
    function setFailExecution(bool _fail) external {
        failExecution = _fail;
    }
    
    function setFailRepayment(bool _fail) external {
        failRepayment = _fail;
    }
    
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        if (failExecution) {
            revert("Execution failed");
        }
        
        if (!failRepayment) {
            uint256 totalDebt = amount + premium;
            IERC20(asset).transfer(msg.sender, totalDebt);
        }
        
        return true;
    }
}
