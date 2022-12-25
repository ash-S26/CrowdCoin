// Creating an instance of web3 depending on users condition
// User may or may not be using metamask or other wallets, so to take care proper
// provider is used in repective condition. Also in deploy.js we used our account to
// deploy contract but we don't want to pay for transaction(creating new campaign, voting, make request for funds)
// performed by our website users, we want then to use their ether and account
// so we define a provider in below way

import Web3 from "web3";

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // If in the browser and metamask/any-wallet is running on website viewer/user so we use
  // provider from that wallet-service with our web3 instance, so user can do transactions (means can do various activites)
  // using their account.
  web3 = new Web3(window.web3.currentProvider);
} else {
  // If we are on the server (nextJS ie backend) *OR* the user is not running metamask/wallet-service then
  // if we don't give then provider, they won't even able to see our website due to lack on provider which
  // facilates communication with etherum network. So to avoid this and atleast allow users to view
  // our website we provide then an infura node which will act as medium between browser and ethereum network
  // to fetch data, but still user won't be able to do any transactions like create campaign as they don't have
  // a account.
  const provider = new Web3.providers.HttpProvider(
    'https://sepolia.infura.io/v3/b27a9de58ee84f71990ac4577054e55d'
  );
  web3 = new Web3(provider);
}

export default web3;

// Here we have not provided 12 word mnemonic as we are using provider from users browser
// which is injected by there wallet so they will use their account for transactions.
// The provider have already access to users accounts and user can select network to interact
// with from drop down.
