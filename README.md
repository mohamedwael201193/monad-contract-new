# Monad Contract Deployer

A modern React application for deploying and interacting with smart contracts on Monad Testnet. Built with React, Vite, Tailwind CSS, and Ethers.js.

## 🚀 Features

### Smart Contract Deployment
- **Counter Contract**: Simple counter with increment, decrement, and reset functionality
- **MessageStorage Contract**: Store and retrieve messages on the blockchain
- **SimpleToken Contract**: Basic ERC20-like token with mint, burn, and transfer features

### Web3 Integration
- **MetaMask Connection**: Seamless wallet integration
- **Monad Testnet Support**: Automatic network switching and configuration
- **Real-time Balance**: Live MON balance updates
- **Transaction Monitoring**: Track deployment and interaction status

### User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Activity Tracking**: Counters for deployments and interactions
- **Contract Management**: View and interact with all deployed contracts
- **Status Indicators**: Real-time feedback for all operations

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Web3**: Ethers.js v6
- **Icons**: Lucide React
- **Smart Contracts**: Solidity

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- MetaMask browser extension
- MON tokens on Monad Testnet (get from [faucet](https://testnet-faucet.monad.xyz))

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/mohamedwael201193/monad-contract-new.git
cd monad-contract-new
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Start Development Server
```bash
npm run dev
# or
pnpm run dev
```

### 4. Open in Browser
Navigate to `http://localhost:5173`

## 🔧 Configuration

### Monad Testnet Settings
The application automatically configures Monad Testnet with these settings:
- **Chain ID**: 10143
- **RPC URL**: https://testnet-rpc.monad.xyz
- **Explorer**: https://testnet-explorer.monad.xyz
- **Currency**: MON

## 📖 How to Use

### 1. Connect Wallet
- Click "Connect MetaMask" button
- Approve the connection in MetaMask
- The app will automatically switch to Monad Testnet

### 2. Deploy Contracts
Choose from three contract types:

#### Counter Contract
- Simple counter starting at 0
- Functions: increment(), decrement(), reset()
- Perfect for testing basic interactions

#### MessageStorage Contract
- Store messages on the blockchain
- Set initial message during deployment
- Functions: setMessage(), clearMessage()

#### SimpleToken Contract
- ERC20-like token functionality
- Configure name, symbol, decimals, and initial supply
- Functions: mint(), burn(), transfer()

### 3. Interact with Contracts
- View deployed contracts in the right panel
- Each contract shows current state and available actions
- Click buttons to call contract functions
- Monitor transaction status in real-time

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── WalletInfo.jsx      # Wallet connection and info
│   ├── ContractDeployment.jsx  # Contract deployment forms
│   ├── ContractCard.jsx    # Individual contract interface
│   └── StatsCard.jsx       # Activity statistics
├── hooks/              # Custom React hooks
│   ├── useWeb3.js          # Web3 wallet management
│   ├── useContractDeployment.js  # Contract deployment logic
│   └── useContractInteraction.js # Contract interaction logic
├── config/             # Configuration files
│   └── web3.js             # Web3 and contract configurations
└── contracts/          # Solidity smart contracts
    ├── Counter.sol         # Counter contract
    ├── MessageStorage.sol  # Message storage contract
    └── SimpleToken.sol     # Token contract
```

## 🔗 Smart Contracts

### Counter.sol
```solidity
// Simple counter with owner controls
function increment() public
function decrement() public
function reset() public onlyOwner
```

### MessageStorage.sol
```solidity
// Message storage with history
function setMessage(string memory _message) public
function clearMessage() public onlyOwner
```

### SimpleToken.sol
```solidity
// ERC20-like token functionality
function mint(address to, uint256 amount) public onlyOwner
function burn(uint256 amount) public
function transfer(address to, uint256 amount) public
```

## 🌐 Deployment

### Build for Production
```bash
npm run build
# or
pnpm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🔍 Testing

The application includes comprehensive error handling and user feedback:
- Transaction status monitoring
- Gas estimation and error handling
- Network connectivity checks
- Contract state synchronization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Demo**: [https://monad-contract-new.vercel.app](https://monad-contract-new.vercel.app)
- **Monad Testnet Explorer**: [https://testnet-explorer.monad.xyz](https://testnet-explorer.monad.xyz)
- **Monad Testnet Faucet**: [https://testnet-faucet.monad.xyz](https://testnet-faucet.monad.xyz)
- **Monad Documentation**: [https://docs.monad.xyz](https://docs.monad.xyz)

## 🆘 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure MetaMask is connected to Monad Testnet
3. Verify you have sufficient MON for gas fees
4. Open an issue on GitHub with detailed information

---

Built with ❤️ for the Monad ecosystem

