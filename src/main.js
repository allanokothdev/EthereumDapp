let accounts;

//Allan Coin Smart Contract Address
const allanCoinAddress = "0xDecD7e0941e33Cfa7d36329739DBcD77282Aa027";

//Allan Coin Smart Contract ABI
const allancoinABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
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
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]

let provider;

window.onload = function () {
    this.console.log("Dapp is Loaded");

    if (window.ethereum) {
        //we can access web3!
        this.ethereum.on('accountsChanged', handleAccountsChanged);

        window.ethereum.request({ method: 'eth_accounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                console.log(err);
            });

            //provider = new ethers.providers.JsonRpcProvider();
            provider = new ethers.providers.Web3Provider(window.ethereum);
            this.console.log(provider);
    } else {
        this.console.log("Please install a digital wallet like Metamark");
    }
}

const handleAccountsChanged = async (a) => {
    console.log("Accounts changed");
    accounts = a;
    console.log(accounts);
}

//Connecting User to Wallet
const enableEth = async () => {
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }).catch((err) => {
        //Error handling
        console.log(err.code);
    })

    console.log(accounts);
}

//Checking user accounts balance
const checkEthBalance = async () => {
    let balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0]]
    }).catch((err) => {
        console.log(err.code);
    });

    //Converting wei to eth
    balance = parseInt(balance);
    balance = balance / Math.pow(10, 18);
    console.log(balance);
}

const sendTransaction = async () => {

    let params = [
        {
            from: accounts[0],
            to: '0xaac27FD70E2466eF027087D13342a972AADB94bf',
            gas: Number(21000).toString(16),
            gasPrice: Number(2500000).toString(16),
            value: Number(1000000000000000000).toString(16),
        }
    ];

    let result = await window.ethereum.request({ method: 'eth_sendTransaction', params }).catch((err) => {
        console.log(err)
    })
}

const checkTokenBalance = async () => {

    //Contract Instance
    let libcContract = new ethers.Contract(allanCoinAddress, allancoinABI, provider);
    //console.log(libcContract);

    //ERC 20 BalanceOf Function
    let balance = await libcContract.balanceOf(accounts[0]);

    console.log(balance.toString());
}

const transferToken = async () => {

    try {

        //changing blockchain state requires a signer 
        let signer = provider.getSigner();
 
        let libcContract = new ethers.Contract(allanCoinAddress, allancoinABI, signer);
        
        const amount = ethers.utils.parseUnits("0.01", 10);
        let tx = await libcContract.transfer("0xaac27FD70E2466eF027087D13342a972AADB94bf", amount);    
        
        checkEvents();
        
    } catch (error) {
        console.error(error);
    }
}

const checkEvents = async () => {
    try {

        //reading blockchain contents requires provider
        let libcContract = new ethers.Contract(allanCoinAddress, allancoinABI, provider);
        libcContract.on("Transfer", (from, to, amount) => {
            console.log(from, to, amount.toString());
            console.log("Got the event");
        })
        
    } catch (error) {
        console.error(error);
    }
}

const simpleSignature = async () => {

    const signer = provider.getSigner();

    let message = "We are learning about developing applications for web3 together!";

    let signature = await signer.signMessage(message);

    console.log(signature);

    let address = ethers.utils.verifyMessage(message, signature);

    console.log(address);

    console.log(accounts[0]);
}