# Express GraphQl Server

In this file for our set-up we have used `ApolloServer` (with express) but we can do the same by using the `exress apollo` 
[https://github.com/graphql/express-graphql](https://github.com/graphql/express-graphql)

Graphql server is an easy way to get graphql working with your existing express app. Install it with `npm install express graphql express-graphql`.
[https://httptoolkit.tech/blog/simple-graphql-server-without-apollo/](https://httptoolkit.tech/blog/simple-graphql-server-without-apollo/)

```
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
  console.log('Server running on Port 4000!')
})
```

Test - [http://localhost:4000/graphiql](http://localhost:4000/graphiql)

Restructured the files:
Instead of running the whoel application from server/index.js, its now been broken down to various files for ease.
- Main - server/index.js
- Mock Data - server/authors.js
- Schema - TypeDefs - server/schema.js
- Resolver - server/resolver.js