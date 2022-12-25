// Creating a instance or we can say we are trying to connect to instance of CampaignFactor that
// we have already deployed on network. We require ABI and address of deployed
// contract for connecting and interacting with it.

// importing web3 instance we created in file web.js to use here
import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

// Accessing instance of deployed CampaignFactor contract
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xAd5C67CDF28Ed6DA61c7662BDB41dBd22708B116'
);

export default instance;
