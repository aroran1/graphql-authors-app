const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolver');
const typeDefs = require('./schema');

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

app.listen(port, () => {
  // console.log(`Server is listening to ${port}!`)
  console.log(`Server is listening to http://localhost:${port}${server.graphqlPath}`)
});