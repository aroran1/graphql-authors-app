
const express = require('express');
const { graphqlHTTP } = require('express-graphql'); // this is part of express graphql package
const { buildSchema } = require('graphql'); // coming from regular graphql

// Create a schema and a root resolver:
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);
const rootResolver = {
  hello: () => 'Hello world!'
};

// Create a server:
const app = express();

// Use those to handle incoming requests:
app.use(graphqlHTTP({
  schema,
  rootValue: rootResolver,
  graphiql: true
}));

app.listen('4000', () => {
  console.log('Server running on Port 4000!') // test it on http://localhost:4000/graphiql
})