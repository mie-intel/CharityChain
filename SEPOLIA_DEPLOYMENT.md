# 🚀 SEPOLIA DEPLOYMENT CHECKLIST

## 📋 Prerequisites

### 1. 🔑 Setup API Keys

- [ ] Buat akun di [Infura](https://infura.io/) atau [Alchemy](https://alchemy.com/)
- [ ] Dapatkan Sepolia RPC URL
- [ ] Buat akun di [Etherscan](https://etherscan.io/apis)
- [ ] Dapatkan Etherscan API Key untuk verification

### 2. 💰 Funding Wallet

- [ ] Pastikan wallet Anda memiliki Sepolia ETH
- [ ] Minimum 0.1 ETH untuk deployment
- [ ] Dapatkan Sepolia ETH dari faucet:
  - [Sepolia Faucet](https://sepoliafaucet.com/)
  - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
  - [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)

### 3. 🔧 Environment Setup

- [ ] Update `.env` file dengan:
  - `SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
  - `ETHERSCAN_API_KEY=YOUR_API_KEY`
  - `PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY`

## 🛠️ Deployment Steps

### Step 1: Install Dependencies

```bash
cd contract
npm install
```

### Step 2: Compile Contracts

```bash
npm run compile
```

### Step 3: Test Locally (Optional)

```bash
npm test
```

### Step 4: Deploy to Sepolia

```bash
# Using custom sepolia script (recommended)
npx hardhat run scripts/deploy-sepolia.js --network sepolia

# Or using regular deploy script
npm run deploy:sepolia
```

### Step 5: Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## 🔧 Troubleshooting

### Common Issues:

1. **Gas Issues**

   - Increase gas limit in hardhat.config.js
   - Check current gas prices on [ETH Gas Station](https://ethgasstation.info/)

2. **RPC Issues**

   - Try alternative RPC URLs
   - Check API key limits

3. **Private Key Issues**

   - Ensure private key is without 0x prefix in .env
   - Check wallet has sufficient Sepolia ETH

4. **Verification Issues**
   - Wait 1-2 minutes after deployment
   - Ensure Etherscan API key is correct

## 📝 Post-Deployment Tasks

- [ ] Update frontend contract address
- [ ] Update frontend to use Sepolia network
- [ ] Test all contract functions on Sepolia
- [ ] Document deployed contract address
- [ ] Share contract address with team

## 🌐 Network Details

- **Network Name**: Sepolia
- **Chain ID**: 11155111
- **RPC URL**: https://rpc.sepolia.org
- **Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepoliafaucet.com/
