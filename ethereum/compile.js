const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// get path of build folder and delete everything inside folder as well as folder
const buildPath = path.resolve(__dirname , "build");
fs.removeSync(buildPath);

// read the Campaign.sol file
const campaignPath = path.resolve(__dirname , "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath , 'utf8');

// compile the solidity code read from Campaign.sol and stored in source variable
// The output of compile have bunch of details but we want only contracts
// property which have ABI and bytecode
const output = solc.compile(source, 1).contracts;

// If build folder don't exist , then create it
fs.ensureDirSync(buildPath);

// We will loop over output that holds all contracts, and for each contracts
// we will create a file with contract_name.json which have that contracts
// data

//console.log(output);
for(let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}
