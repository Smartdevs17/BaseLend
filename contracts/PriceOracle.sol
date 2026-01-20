// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PriceOracle
 * @dev Price oracle for DeFi lending platform
 */
contract PriceOracle is Ownable {
    
    mapping(address => uint256) public prices; // Price in USD with 8 decimals
    mapping(address => uint256) public lastUpdated;
    
    uint256 public constant PRICE_DECIMALS = 8;
    uint256 public maxPriceAge = 1 hours;
    
    event PriceUpdated(address indexed token, uint256 price, uint256 timestamp);
    
    constructor() Ownable(msg.sender) {}
    
    function updatePrice(address _token, uint256 _price) external onlyOwner {
        require(_token != address(0), "Invalid token");
        require(_price > 0, "Invalid price");
        
        prices[_token] = _price;
        lastUpdated[_token] = block.timestamp;
        
        emit PriceUpdated(_token, _price, block.timestamp);
    }
    
    function updatePrices(address[] memory _tokens, uint256[] memory _prices) external onlyOwner {
        require(_tokens.length == _prices.length, "Length mismatch");
        
        for (uint256 i = 0; i < _tokens.length; i++) {
            require(_tokens[i] != address(0), "Invalid token");
            require(_prices[i] > 0, "Invalid price");
            
            prices[_tokens[i]] = _prices[i];
            lastUpdated[_tokens[i]] = block.timestamp;
            
            emit PriceUpdated(_tokens[i], _prices[i], block.timestamp);
        }
    }
    
    function getPrice(address _token) external view returns (uint256) {
        require(prices[_token] > 0, "Price not set");
        require(block.timestamp - lastUpdated[_token] <= maxPriceAge, "Price too old");
        
        return prices[_token];
    }
    
    function getPriceUnsafe(address _token) external view returns (uint256) {
        return prices[_token];
    }
    
    function setMaxPriceAge(uint256 _maxAge) external onlyOwner {
        maxPriceAge = _maxAge;
    }
}
