// Creating a instance or we can say we are trying to connect to instance of Campaign that
// we have already deployed on network. We require ABI and address of deployed
// contract for connecting and interacting with it

// importing web3 instance we created in file web.js to use here
import web3 from "./web3";
// importing Campaign deployed object which have properties like ABI and bytecode from build folder
import Campaign from "./build/Campaign.json";

export default (address) => {
  return new web3.eth.Contract(
    JSON.parse(Campaign.interface),
    address
  );
};
