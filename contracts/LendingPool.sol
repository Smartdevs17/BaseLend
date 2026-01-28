// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LendingPool
 * @dev Main lending pool contract for BaseLend DeFi platform
 */
contract LendingPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    /**
     * @notice Stores information about a user's deposit
     * @param amount The amount deposited
     * @param depositTime The timestamp of the last deposit
     * @param interestEarned Total interest earned by the user (accrued)
     */
    struct UserDeposit {
        uint256 amount;
        uint256 depositTime;
        uint256 interestEarned;
    }
    
    /**
     * @notice Stores information about a loan
     * @param borrower Address of the user receiving the loan
     * @param amount Amount of tokens borrowed
     * @param collateralAmount Amount of tokens provided as collateral
     * @param collateralToken Address of the token used as collateral
     * @param interestRate Interest rate applied to this loan
     * @param startTime Timestamp when the loan was created
     * @param duration Duration of the loan in seconds
     * @param isActive True if the loan is currently active
     * @param isRepaid True if the loan has been fully repaid
     */
    struct Loan {
        address borrower;
        uint256 amount;
        uint256 collateralAmount;
        address collateralToken;
        uint256 interestRate;
        uint256 startTime;
        uint256 duration;
        bool isActive;
        bool isRepaid;
    }
    
    /// @notice Maps user address and token address to UserDeposit data
    mapping(address => mapping(address => UserDeposit)) public deposits;
    
    /// @notice Maps loan ID to Loan data
    mapping(uint256 => Loan) public loans;
    
    /// @notice True if a token is supported for lending and collateral
    mapping(address => bool) public supportedTokens;
    
    /// @notice Incremental counter for loan IDs
    uint256 public loanIdCounter;
    
    /// @notice The current base interest rate in basis points (e.g. 500 = 5%)
    uint256 public baseInterestRate = 500;
    
    /// @notice The required collateral ratio in basis points (e.g. 15000 = 150%)
    uint256 public collateralRatio = 15000;
    
    event Deposited(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower);
    event TokenSupported(address indexed token);
    
    constructor() Ownable(msg.sender) {
        loanIdCounter = 1;
    }
    
    function addSupportedToken(address _token) external onlyOwner {
        require(_token != address(0), "Invalid token");
        supportedTokens[_token] = true;
        emit TokenSupported(_token);
    }
    
    function deposit(address _token, uint256 _amount) external nonReentrant {
        require(supportedTokens[_token], "Token not supported");
        require(_amount > 0, "Amount must be > 0");
        
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        
        deposits[msg.sender][_token].amount += _amount;
        deposits[msg.sender][_token].depositTime = block.timestamp;
        
        emit Deposited(msg.sender, _token, _amount);
    }
    
    function withdraw(address _token, uint256 _amount) external nonReentrant {
        require(deposits[msg.sender][_token].amount >= _amount, "Insufficient balance");
        
        deposits[msg.sender][_token].amount -= _amount;
        IERC20(_token).safeTransfer(msg.sender, _amount);
        
        emit Withdrawn(msg.sender, _token, _amount);
    }
    
    function borrow(
        address _token,
        uint256 _amount,
        address _collateralToken,
        uint256 _collateralAmount,
        uint256 _duration
    ) external nonReentrant returns (uint256) {
        require(supportedTokens[_token], "Token not supported");
        require(supportedTokens[_collateralToken], "Collateral not supported");
        require(_amount > 0, "Amount must be > 0");
        require(_collateralAmount >= (_amount * collateralRatio) / 10000, "Insufficient collateral");
        
        IERC20(_collateralToken).safeTransferFrom(msg.sender, address(this), _collateralAmount);
        
        uint256 loanId = loanIdCounter++;
        
        loans[loanId] = Loan({
            borrower: msg.sender,
            amount: _amount,
            collateralAmount: _collateralAmount,
            collateralToken: _collateralToken,
            interestRate: baseInterestRate,
            startTime: block.timestamp,
            duration: _duration,
            isActive: true,
            isRepaid: false
        });
        
        IERC20(_token).safeTransfer(msg.sender, _amount);
        
        emit LoanCreated(loanId, msg.sender, _amount);
        
        return loanId;
    }
    
    function repay(uint256 _loanId, address _token) external nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.isActive, "Loan not active");
        require(loan.borrower == msg.sender, "Not borrower");
        
        uint256 interest = calculateInterest(_loanId);
        uint256 totalRepayment = loan.amount + interest;
        
        IERC20(_token).safeTransferFrom(msg.sender, address(this), totalRepayment);
        
        loan.isActive = false;
        loan.isRepaid = true;
        
        IERC20(loan.collateralToken).safeTransfer(msg.sender, loan.collateralAmount);
        
        emit LoanRepaid(_loanId, msg.sender);
    }
    
    function calculateInterest(uint256 _loanId) public view returns (uint256) {
        Loan memory loan = loans[_loanId];
        uint256 timeElapsed = block.timestamp - loan.startTime;
        return (loan.amount * loan.interestRate * timeElapsed) / (10000 * 365 days);
    }
    
    function setBaseInterestRate(uint256 _rate) external onlyOwner {
        baseInterestRate = _rate;
    }
    
    function setCollateralRatio(uint256 _ratio) external onlyOwner {
        collateralRatio = _ratio;
    }
}
