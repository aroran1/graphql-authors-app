# Apollo Server
You ca set up your application to work with graphQl eithee by using apollo server or [express graphql](./guides/expressGraphqlServer) package.

Apollo Server installs `npm install express apollo-server-express graphql core-js`
Express Server installs `npm install express graphql express-graphql`

https://www.apollographql.com/docs/apollo-server/getting-started/

Read the differences between using [apollo setup vs express graphql](./guides/apolloVsExpressgraphql.md)

### basic graphql api with express
server/index-basic-graphql-express.js
```
const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

app.use('/graphql', (req, res) => {
  res.send('Welcome to our Authors App!'); // test it on http://localhost:3000/graphql
})

app.listen(port, () => {
  console.log(`Server is listening to ${port}!`)
});
```

### graphql api with express and apollo
server/index.js
When server is ready, click on the `/graphql` link, that'll lead to apollo playground. This is similar to GraphQL created by FB. This tool is useful to quickly make queries to the api and see the results instanly.

- import ApolloServer
- add some fake authors data to be returned from resolvers `const authors = [{...}, {...}];`
- Create typeDefs 
  - by creating schemas for Author and Person
  ```
  const typeDefs = `
    type Author {...}
    type Person {...}
  `;
  ```
  - type Query is a special type which defines what our client can call from the api with operations which is set to return an array of authors
  ```
  type Query {
    getAuthors: [Author]
  }
  ```
- Resolvers is where things get done, when the query operation is called graphql runs the resolver method (same name as query method) in the background. Connecting right resolver with right typeDefs is handled by apollo. When we create a new instance of the server, we pass both in.
```
const resolvers = {
  Query: {
    getAuthors: () => authors // returning the mocked authors array data
  }
}
```

- Create a new instance of `apolloserver` by `const server = new ApolloServer({ typeDefs, resolvers});` and pass the typeDefs and resolvers for it to link them together.
- Create a new express web server `const app = express()`
- On apollo server, applyMiddleware to let it use express server and expose the `/graphql` endpoint instead of express traditional way of `app.use('/graphql', (res, res => { res.send('mesage!')}))`
```
server.applyMiddleware({
  app,
  path: '/graphql'
})
```
- Finally ruen `npm run start` and test it out on the apollo playground on http://localhost:3000/graphql
```
app.listen(port, () => {
  // console.log(`Server is listening to ${port}!`)
  console.log(`Server is listening to http://localhost:${port}${server.graphqlPath}`)
});
```
Pass below query to see the data returned. Note that the structure of the response mirrors the 
```
query {
  getAuthors {
    info {
      name
      age
    }
  }
}
{
  "data": {
    "getAuthors": [
      {
        "info": {
          "name": "Joe Kelly",
          "age": 32
        }
      },
      {
        "info": {
          "name": "Mary Jane",
          "age": 27
        }
      }
    ]
  }
}
```

server/index.js
```
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const port = process.env.PORT || 3000;

// Some fake data - usually this will come from database
const authors = [
  {
    id: 1,
    info: {
      name: "Joe Kelly",
      age: 32,
      gender: "M",
    }
  },
  {
    id: 2,
    info: {
      name: "Mary Jane",
      age: 27,
      gender: "F",
    }
  }
];

// Schema - GraphQl schema (in string form) that we want api to return
// ! - is for required
// Query is a special type which defines what our client can request from the api via operations
// here  getAuthors is an operation which returns an array of Authors
// Note when someone calls the `getAuthors` query we will run the resolver with the same name
const typeDefs = `
  type Author {
    id: ID!
    info: Person
  }
  type Person {
    name: String!
    age: Int
    gender: String
  }
  type Query {
    getAuthors: [Author]
  }
`;

// resolvers
// resolvers is the code that makes things happen
// when someone calls the query method we will run the resolver with the same name (which has to be identical)
// that's how graphql know which code to run for which query
// rest is taken care by our apollo server, it makes sure that right typeDefs are linked with right resolver
const resolvers = {
  Query: {
    getAuthors: () => authors
  }
}

// We create a new instance of ApolloServer and pass the tyepDefs and resolvers 
// to put together schema or link the 2 together
const server = new ApolloServer({ typeDefs, resolvers});

// create a new express web server
const app = express();

// then we tell our apollo server to use the express server and expose `/graphQl` endpoint
// instead of exposing the endpoint via app.use('/graphql', (req, res) => {...})
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
```

In this file for our set-up we have used `ApolloServer` (with express) but we can do the same by using the `exress apollo` 
[https://github.com/graphql/express-graphql](https://github.com/graphql/express-graphql)
