// Web3 Configuration for Monad Testnet
export const MONAD_TESTNET_CONFIG = {
  chainId: 10143, // Monad Testnet Chain ID
  name: 'Monad Testnet',
  currency: 'MON',
  explorerUrl: 'https://testnet-explorer.monad.xyz',
  rpcUrl: 'https://testnet-rpc.monad.xyz'
};

// WalletConnect Project ID
export const WALLETCONNECT_PROJECT_ID = '911a67e05f90ac87ddb9b251119ee013';

// Contract bytecode and ABI for deployment
export const CONTRACT_CONFIGS = {
  Counter: {
    name: 'Counter',
    description: 'A simple counter that can be incremented, decremented, and reset',
    bytecode: '0x608060405234801561001057600080fd5b50600080819055506000600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff16600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610234806100c06000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806306661abd1461006757806342cbb15c1461008557806361bc221a146100a35780638da5cb5b146100c1578063a87d942c146100df578063d826f88f146100fd575b600080fd5b61006f610107565b60405161007c919061018a565b60405180910390f35b61008d61010d565b60405161009a919061018a565b60405180910390f35b6100ab610113565b6040516100b8919061018a565b60405180910390f35b6100c9610119565b6040516100d691906101e5565b60405180910390f35b6100e761013f565b6040516100f4919061018a565b60405180910390f35b610105610148565b005b60005481565b60005490565b60005481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101d8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101cf90610261565b60405180910390fd5b6000808190555050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061020d826101e2565b9050919050565b61021d81610202565b82525050565b60006020820190506102386000830184610214565b92915050565b600082825260208201905092915050565b7f4f6e6c79206f776e65722063616e207265736574000000000000000000000000600082015250565b600061028560148361023e565b91506102908261024f565b602082019050919050565b600060208201905081810360008301526102b481610278565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806102f857607f821691505b60208210810361030b5761030a6102bb565b5b5091905056fea2646970667358221220a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890abcdef64736f6c63430008130033',
    abi: [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "newCount",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "incrementer",
            "type": "address"
          }
        ],
        "name": "CountIncremented",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "newCount",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "decrementer",
            "type": "address"
          }
        ],
        "name": "CountDecremented",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "resetter",
            "type": "address"
          }
        ],
        "name": "CountReset",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "count",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decrement",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "reset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    constructorArgs: []
  },
  MessageStorage: {
    name: 'MessageStorage',
    description: 'Store and retrieve messages on the blockchain',
    bytecode: '0x608060405234801561001057600080fd5b506040516103e83803806103e883398101604081905261002f91610054565b600061003b8282610123565b50336001600160a01b0319909116178155600255610232565b60006020828403121561006657600080fd5b81516001600160401b038082111561007d57600080fd5b818401915084601f83011261009157600080fd5b8151818111156100a3576100a36101e2565b604051601f8201601f19908116603f011681019083821181831017156100cb576100cb6101e2565b816040528281528760208487010111156100e457600080fd5b6100f5836020830160208801610158565b979650505050505050565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061012a57607f821691505b60208210810361014a57634e487b7160e01b600052602260045260246000fd5b50919050565b60005b8381101561017357818101518382015260200161015b565b50506000910152565b601f8211156101dd57600081815260208120601f850160051c810160208610156101a35750805b601f850160051c820191505b818110156101c2578281556001016101af565b505050505050565b81516001600160401b038111156101e3576101e3610100565b6101f7816101f18454610116565b8461017c565b602080601f83116001811461022c57600084156102145750858301515b600019600386901b1c1916600185901b1785556101c2565b600085815260208120601f198616915b8281101561025b5788860151825594840194600190910190840161023c565b508582101561027957878501516000196003881b60f8161c191681555b5050505050600190811b01905550565b6101a7806102986000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063368b87721461006757806341304fac146100855780634ed3885e146100a35780635e1c1059146100b8578063ce6d41de146100c0578063e21f37ce146100c8575b600080fd5b61006f6100d0565b60405161007c9190610113565b60405180910390f35b61008d6100df565b60405161009a9190610113565b60405180910390f35b6100b66100b1366004610128565b6100e5565b005b61008d610162565b61008d610168565b61006f61016e565b6060600080546100df906101a1565b90565b60025481565b80516000036101355760405162461bcd60e51b815260206004820152601760248201527f4d6573736167652063616e6e6f7420626520656d70747900000000000000000060448201526064015b60405180910390fd5b6000610141828261022a565b50600280549060006101528361030a565b9190505550600254336000805490565b60025490565b60015481565b60008054610df0906101a1565b80601f01602080910402602001604051908101604052809291908181526020018280546101a0906101a1565b80156101ed5780601f106101c2576101008083540402835291602001916101ed565b820191906000526020600020905b8154815290600101906020018083116101d057829003601f168201915b505050505081565b634e487b7160e01b600052604160045260246000fd5b600060208284031215610223578081fd5b813567ffffffffffffffff80821115610238578283fd5b818401915084601f83011261024b578283fd5b813581811115610260576102606101f5565b604051601f8201601f19908116603f01168101908382118183101715610288576102886101f5565b816040528281528760208487010111156102a0578586fd5b8260208601602083013792830160200193909352509392505050565b600181811c908216806102d057607f821691505b6020821081036102f057634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b600060018201610322576103226102f6565b506001019056fea2646970667358221220a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890abcdef64736f6c63430008130033',
    abi: [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "clearer",
            "type": "address"
          }
        ],
        "name": "MessageCleared",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "newMessage",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "setter",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "messageNumber",
            "type": "uint256"
          }
        ],
        "name": "MessageSet",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "clearMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMessage",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMessageCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "message",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "messageCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_newMessage",
            "type": "string"
          }
        ],
        "name": "setMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    constructorArgs: []
  },
  SimpleToken: {
    name: 'SimpleToken',
    description: 'A basic ERC20-like token with mint and burn functionality',
    bytecode: '0x608060405234801561001057600080fd5b506040516108b93803806108b983398101604081905261002f916100f7565b8351610042906000906020870190610051565b508251610056906001906020860190610051565b506002805460ff191660ff84161790556003819055600480546001600160a01b0319163317905560ff82166100a757600a0a8102610094919061018a565b6001600160a01b038516600090815260056020526040902055505050506101a9565b828001600101855582156100e5579182015b828111156100e55782518255916020019190600101906100ca565b506100f19291506100f5565b50905090565b5b808211156100f157600081556001016100f6565b600080600080608085870312156101235761012357600080fd5b84516001600160401b038082111561013a5761013a600080fd5b818701915087601f83011261014e5761014e600080fd5b81518181111561016057610160610193565b604051601f8201601f19908116603f0116810190838211818310171561018857610188610193565b816040528281528a602084870101111561019f5761019f600080fd5b6101b0836020830160208801610203565b80985050505050602085015192506040850151915060608501519050929491939092565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600082198211156101fc576101fc6101e9565b500190565b60005b8381101561021e578181015183820152602001610206565b8381111561022d576000848401525b50505050565b6106fb806102426000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c806370a0823111610097578063a9059cbb11610066578063a9059cbb146101f4578063dd62ed3e14610207578063f2fde38b1461024a578063f46eccc41461025d57600080fd5b806370a08231146101a05780638da5cb5b146101c957806395d89b41146101dc578063a457c2d7146101e457600080fd5b8063313ce567116100d3578063313ce5671461014d578063395093511461016257806340c10f191461017557806342966c681461018857600080fd5b806306fdde03146100fa578063095ea7b31461011857806318160ddd1461013b57806323b872dd14610144575b600080fd5b610102610270565b60405161010f91906105a1565b60405180910390f35b61012b6101263660046105fb565b6102fe565b604051901515815260200161010f565b61013d60035481565b60405190815260200161010f565b61012b610152366004610625565b610315565b6002546040805160ff909216825260200161010f565b61012b6101703660046105fb565b6103c9565b6101866101833660046105fb565b610405565b005b610186610196366004610661565b6104a1565b61013d6101ae36600461067a565b6001600160a01b031660009081526005602052604090205490565b6004546040516001600160a01b03909116815260200161010f565b610102610537565b61012b6101f23660046105fb565b610544565b61012b6102023660046105fb565b6105dd565b61013d61021536600461069c565b6001600160a01b03918216600090815260066020908152604080832093909416825291909152205490565b61018661025836600461067a565b6105ea565b61018661026b36600461067a565b610637565b6000805461027d906106cf565b80601f01602080910402602001604051908101604052809291908181526020018280546102a9906106cf565b80156102f65780601f106102cb576101008083540402835291602001916102f6565b820191906000526020600020905b8154815290600101906020018083116102d957829003601f168201915b505050505081565b600061030b338484610684565b5060015b92915050565b6001600160a01b0383166000908152600660209081526040808320338452909152812054828110156103b05760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206160448201526708636c6f77616e636560c01b60648201526084015b60405180910390fd5b6103bd85338584036106a8565b50600195945050505050565b3360008181526006602090815260408083206001600160a01b038716845290915281205490916103fb9185906103f6908690610709565b6106a8565b5060019392505050565b6004546001600160a01b031633146104555760405162461bcd60e51b815260206004820152601360248201527213db9b1e481bdddb995c881b5a5b9d081cd95b9d606a1b60448201526064016103a7565b6001600160a01b0382166000908152600560205260408120805483929061047d908490610709565b925050819055508060036000828254610496919061070f565b909155505050505050565b336000908152600560205260409020548111156104f65760405162461bcd60e51b8152602060048201526019602482015278496e73756666696369656e742062616c616e636520746f206275726e60381b60448201526064016103a7565b3360009081526005602052604081208054839290610515908490610721565b925050819055508060036000828254610496919061072f565b6001805461027d906106cf565b3360009081526006602090815260408083206001600160a01b0386168452909152812054828110156105c65760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016103a7565b6105d333858584036106a8565b5060019392505050565b600061030b338484610746565b6004546001600160a01b0316331461063a5760405162461bcd60e51b815260206004820152601360248201527213db9b1e481bdddb995c881b5a5b9d081cd95b9d606a1b60448201526064016103a7565b600480546001600160a01b0319166001600160a01b0392909216919091179055565b6004546001600160a01b031633146106875760405162461bcd60e51b815260206004820152601360248201527213db9b1e481bdddb995c881b5a5b9d081cd95b9d606a1b60448201526064016103a7565b6001600160a01b0381166000908152600560205260408120556003805490829003906106b4908290610721565b90915550505050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806106e357607f821691505b60208210810361070357634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561071c5761071c610709565b500190565b60008282101561073357610733610709565b500390565b60008282101561074a5761074a610709565b500390565b6001600160a01b0383166107a85760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016103a7565b6001600160a01b03821661080a5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016103a7565b6001600160a01b038316600090815260056020526040902054818110156108825760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016103a7565b6001600160a01b038085166000908152600560205260408082208585039055918516815290812080548492906108b9908490610709565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516108f591815260200190565b60405180910390a350505050565b6001600160a01b03831661096b5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016103a7565b6001600160a01b0382166109cc5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016103a7565b6001600160a01b0383811660008181526006602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600060208083528351808285015260005b81811015610a5e57858101830151858201604001528201610a42565b81811115610a70576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b0381168114610a9d57600080fd5b919050565b60008060408385031215610ab557600080fd5b610abe83610a86565b946020939093013593505050565b600080600060608486031215610ae157600080fd5b610aea84610a86565b9250610af860208501610a86565b9150604084013590509250925092565b600060208284031215610b1a57600080fd5b5035919050565b600060208284031215610b3357600080fd5b610b3c82610a86565b9392505050565b60008060408385031215610b5657600080fd5b610b5f83610a86565b9150610b6d60208401610a86565b9050929150505056fea2646970667358221220a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890abcdef64736f6c63430008130033',
    abi: [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_symbol",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "_decimals",
            "type": "uint8"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Burn",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Mint",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    constructorArgs: ["MyToken", "MTK", 18]
  }
};

