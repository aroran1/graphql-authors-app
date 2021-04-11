const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolver');
const typeDefs = require('./schema');
const { createServer} = require('http');

const port = process.env.PORT || 3000;

// We create a new instance of ApolloServer and pass the tyepDefs and resolvers to put together schema or link the 2 together
const server = new ApolloServer({ typeDefs, resolvers});

// create a new express web server
const app = express();

// then we tell our apollo server to use the express server and expose `/graphQl` endpoint
// instead of exposing the endpoint like express server as below
// app.use('/graphql', (req, res) => {
//   res.send('Welcome to our Authors App!'); // test it on http://localhost:3000/graphql
// })
server.applyMiddleware({
  app,
  path: '/graphql'
})

// createServer - creates the server on node to get our machine to act as a server which can listen to requests and response
// Using Node.js on the web generally involves a server framework, like Express, Hapi, or Koa which makes it easy to work with underlying HTTP framework.
// In those case we are using both/all. First we are creating an express server and then we are creating apollo (containing graphql info) and passing the express server to apollo via middleware to use that.
// Now creating node's http createServer to handle our requests and passing express server so it passes those incoming requests to express erver as well. 
const httpServer = createServer(app);
// tell apollo server to install subscription handler and passing the httpServer to it
server.installSubscriptionHandlers(httpServer)
// Finally we making our httpServer listen to the port instead of the express server
// app.listen(port, () => {
httpServer.listen(port, () => {
  // console.log(`Server is listening to ${port}!`)
  console.log(`Server is listening to http://localhost:${port}${server.graphqlPath}`)
});