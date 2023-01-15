// HDWalletProvider is a provider which allows us to make our own provider
// by specifying our 12 word mnemonic and node in network we want to connect to.
// It allows us to sign transaction and use our account for transaction by
// unlocking our account and allows us to connect to external network.
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3"); // importing Web3 class
const compiledFactory = require("./build/CampaignFactory.json");

// We are here connecting to Infura node on sepolia network, infura gives us free
// access to node so we can interact test network. We can also connect to network
// by making our device a node in network but its very tedious process so we
// use infura service which provides us free access to node so we can connect to nod
// and our transactions happends through that node.
const provider = new HDWalletProvider(
  '',  // 12 word mnemonic put here
  'https://sepolia.infura.io/v3/b27a9de58ee84f71990ac4577054e55d'                      // Infura node we want to connect to
);
// API key :- b27a9de58ee84f71990ac4577054e55d    (infura account)


const web3 = new Web3(provider);  // passing provider to web3 constructor and we get an instance of web3

// Deploying CampaignFactory contract from our 1st account
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode }) // We can pass arguments to our contract if needed buy using arguments key ex- { data: compiledFactory.bytecode, arguments: [arg1,arg2] }
    .send({ from: accounts[0], gas:1000000 });

  console.log("Contract deployed to", result.options.address);

};

// dummy function so we can use async await syntact as its not possible to use async await outside a function
deploy();
