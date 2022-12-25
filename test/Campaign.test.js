const assert = require("assert");
const ganache = require("ganache-cli"); // creates local ethereum network for testing purpose
const Web3 = require("web3"); // web3 is our portal to interact with contracts deployed on blockchain

// creating an instance of Web3 class and using default provider provided by ganache.
// Providers are sort of telephone line between web3 (which a portal for us to interact with ethereum world and blockchain)
// and blockchain/ethereum network. Provider provides web3 with accounts that
// it can use to deploy/transactions and also tells web3 to which newtwork
// it needs to communicate with ex - rinkby newtwork, etc
const web3 = new Web3(ganache.provider());

// Importing our compiled contracts
// ABI (Application Binary Interface) :- this is an interface that allows
// javascript to interact with out contract and use its functionality
// as bytecode is not human redable, ABI solves that issue
// Bytecode :- It is machine level code that is actually deployed on
// blockchain/ ethereum network.
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {

  // get accounts that ganache provides us in unlocked state
  accounts = await web3.eth.getAccounts();

  // deploy our CampaignFactory contract to local ethereum newtwork
  // created by ganache.
  // 1st line creates an idea/instance of Contract class defined in web3 with contract which is to be deployed (interface produced by solidity compiler is in JSON format)
  // but our Contract class needs it as javascript object. .eth to specify that we want ethereum module from web3
  // 2nd .deploy creates transaction (every interaction with blockchain is a transaction) object
  // 3rd .send send the transaction to blockchain network and deploy's contract
  // This method of deploying contract is used when we are newly deploying
  // a contract for first time.
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
              .deploy({ data: compiledFactory.bytecode})
              .send({from: accounts[0], gas: "1000000"});

  // Access createCampaign function from CampaignFactory deployed contracts
  // to create a new Campaign.
  // Here createCampaign parantheses () are to provide arguments expected
  // by createCampaign function , where as parantheses of send/call are to
  // mention arguments/data for transaction object.
  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  // We try to retriver list of addresses of deployed Campaign from CampaignFactory and
  // access address of first deployed contract
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  // Here we are trying to access/create and instance to interact with contracts
  // that is already deployed at campaignAddress. This method is used to
  // interact with alrady deployed contrcts. And instruct web3 of its existance
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

// testing
describe("Campaign", async () => {
  it("Deploys a factory and a campaign", () => {
    // Check if CampaignFactory contract is deployed properly and also Campaign
    // contract deployed by CampaignFactory createCampaign function
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0] , manager);
  });

  it("allows people to contribute money and marks then as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: 1000,
      gas: '1000000'
    });

    // All variables that are delacered as public in our contract, a function
    // with name of that variable is automatically created
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("it requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: 10,
        gas: '1000000'
      });
      assert(false);
    } catch(err) {
      assert(err);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
    .createRequest("Buy Batteries",1234,accounts[2])
    .send({
      from: accounts[0],
      gas: 1000000
    });

    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy Batteries", request.description);
  });

  it("processes request", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
      gas: 1000000
    });

    await campaign.methods
      .createRequest("Buy",web3.utils.toWei('5', 'ether'),accounts[1])
      .send({from: accounts[0], gas: 1000000});


    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: 1000000
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: 1000000
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    // console.log(balance);
    assert(balance > 104);
  });


});
