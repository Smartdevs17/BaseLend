# BaseLend - DeFi Lending Platform

Decentralized lending and borrowing platform on Base network with dynamic interest rates and collateral management.

## 📊 Project Statistics

- **Commits**: 5+
- **Contracts**: 4
- **Network**: Base (Mainnet & Sepolia)

## 🚀 Quick Start

```bash
npm install
npx hardhat compile
npx hardhat test
```

## 📝 Contracts

1. **LendingPool** - Core lending/borrowing logic
2. **CollateralManager** - Manage collateral positions
3. **InterestRateModel** - Utilization-based rates
4. **PriceOracle** - Asset price feeds

## ✨ Features

- 💰 Deposit & earn interest
- 🏦 Borrow with collateral
- 📊 Dynamic interest rates
- 🔒 150% collateralization
- ⚡ Base network (low fees)

## 🧪 Testing

```bash
npm test
```

## 🌐 Deployment

```bash
# Base Sepolia
npx hardhat run scripts/deploy.js --network baseSepolia

# Base Mainnet
npx hardhat run scripts/deploy.js --network base
```

## 🔐 Security

⚠️ Not audited - use at own risk

## 📄 License

MIT
