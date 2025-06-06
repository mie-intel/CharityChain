# CharityChain - Smart Contract Documentation

## Project Information

**Project Name:** CharityChain  
**Developers:** Polikarpus Arya & Zaidan Harith  
**Description:** A blockchain-based charity platform enabling transparent donation management and tracking

## Overview

CharityChain is a decentralized charity platform built on Ethereum that allows users to create charity campaigns, make donations, and track fund distribution transparently. This documentation provides comprehensive guidance for testing and deploying the smart contracts both locally and on the Sepolia testnet.

## Features

- Create and manage charity campaigns
- Transparent donation tracking
- Automated fund distribution
- Campaign milestone management
- Donor verification system
- Real-time campaign status updates

## Project Structure

```
CharityChain/
├── contract/                   # Smart contract workspace
│   ├── contracts/             # Smart contract files
│   │   ├── Main.sol            # Main charity contract
│   ├── scripts/               # Deployment Scripts
└── fe/                        # Frontend application
    ├── app/                   # Application routes
    ├── src/                   # Source code
    │   ├── components/        # React components
    │   ├── contracts/         # Contract ABIs
    │   ├── utils/            # Utility functions
    │   └── styles/            # CSS Styling
    └── public/               # Static assets
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MetaMask wallet extension
- Sepolia testnet ETH for gas fees
- Git for version control

## Local Testing Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/CharityChain.git
cd CharityChain
```

### 2. Install Dependencies

```bash
# Install smart contract dependencies
cd contract
npm install

# Install frontend dependencies (if separate folder)
cd fe
npm install
cd ..
```

### 3. Compile Smart Contracts

```bash
npx hardhat compile
```

### 4. Run Local Blockchain

```bash
npm run start
```

### 5. Deploy to Local Network

```bash
npm run deploy
```

### 6. Run Tests

```bash
npx hardhat test
```

## Frontend Setup

### 1. Start Development Server

```bash
cd fe
npm start
```

### 2. Build for Production

```bash
npm run build
```

## Sepolia Testnet Deployment

### 1. Get Sepolia ETH

- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Request test ETH for deployment

### 2. Deploy to Sepolia

```bash
npm run deploy:sepolia
```

### 3. Verify Contract

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Smart Contract Commands

## Common Commands

```bash
# Clean artifacts
npx hardhat clean

# Check contract size
npx hardhat size-contracts

# Run coverage
npx hardhat coverage

# Run linter
npm run lint

# Format code
npm run format
```

## Network Configuration

The project supports multiple networks configured in `hardhat.config.js`:

- **localhost**: Local development
- **sepolia**: Ethereum testnet
- **mainnet**: Ethereum mainnet (production)

## Troubleshooting

### Common Issues

1. **Insufficient gas**: Increase gas limit in transaction
2. **Nonce too low**: Reset MetaMask account
3. **Network mismatch**: Ensure correct network in MetaMask

### Reset Local Environment

```bash
npx hardhat clean
rm -rf artifacts cache
npm install
```
