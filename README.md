# BaseLend DeFi Platform

Decentralized lending and borrowing platform built on Base Ethereum.

## Features

- 💰 **Deposit & Earn**: Deposit ERC20 tokens and earn interest
- 🏦 **Borrow with Collateral**: Borrow against your crypto assets
- 📊 **Dynamic Interest Rates**: Market-driven interest rate model
- 🔒 **Secure Collateral**: 150% collateralization ratio
- ⚡ **Base Network**: Fast and low-cost transactions

## Contracts

### LendingPool.sol
Main lending pool contract handling deposits, withdrawals, and loans.

**Key Functions:**
- `deposit(token, amount)` - Deposit tokens to earn interest
- `withdraw(token, amount)` - Withdraw deposited tokens
- `borrow(token, amount, collateralToken, collateralAmount, duration)` - Borrow with collateral
- `repay(loanId, token)` - Repay loan and retrieve collateral

## Network

- **Base Sepolia** (Testnet): Chain ID 84532
- **Base Mainnet**: Chain ID 8453

## Setup

```bash
npm install
npx hardhat compile
npx hardhat test
```

## Deployment

```bash
# Deploy to Base Sepolia
npx hardhat run scripts/deploy.js --network baseSepolia

# Deploy to Base Mainnet
npx hardhat run scripts/deploy.js --network base
```

## Configuration

Copy `.env.example` to `.env` and configure:
- `PRIVATE_KEY` - Your wallet private key
- `BASE_MAINNET_RPC_URL` - Base mainnet RPC
- `BASE_SEPOLIA_RPC_URL` - Base Sepolia RPC
- `BASESCAN_API_KEY` - For contract verification

## Security

⚠️ **This contract has not been audited. Use at your own risk.**

## License

MIT
