// Here we can define routes that we want in our application, we can handle
// dynamic routing with this which was not possible only with next as next
// just checks for the pages directory and serves all .js file as new route
// for example if it have show.js then route would be "/show" .

// With next-routes package we get ability to setup routing and also use concept
// of dynamic routing

// importing and invoking function from next-routes package.
const routes = require("next-routes")();

// Defining routes , routes are in priority order higher to lower so place them
// properly else one route might get over-written by other.
routes
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:address", "/campaigns/show")
  .add("/campaigns/:address/requests", "/campaigns/requests/index")
  .add("/campaigns/:address/requests/new", "/campaigns/requests/new");


module.exports = routes;

// .add("/campaigns/new", "/campaigns/new")
// This line means add route "/campaigns/new" and when requested for this route
// server "/campaigns/new" file (new.js in campaigns directory inside pages).
// All paths are relative to pages in .add .

// .add("/campaigns/:address", "/campaigns/show")
// Here :address allows dynamic routing where address is a wildcard which can be anything,
// this address is available as props argument in getInitialProps of file "/campaigns/show" .
