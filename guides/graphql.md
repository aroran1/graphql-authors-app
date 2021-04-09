# GraphQl

## What is graphQl?
GraphQl is a query language evelopeed by facebook. It can perform the same operations as REST, only more efficiently.

 --------------                                  
|              |                                    -----------------------------------------------
|              |=================================> |  Allow client to only request what they want  |
|              |                                    -----------------------------------------------
|              |                                    -----------------------------------------------
|              |=================================> |  Single endpoint                              |
|              |                                    -----------------------------------------------
|  Advantages  |                                    -----------------------------------------------
|      of      |=================================> |  Versionless                                  |
|    GraphQl   |                                    -----------------------------------------------
|              |                                    -----------------------------------------------
|              |=================================> |  Faster request-response cycle                |
|              |                                    -----------------------------------------------
|              |                                    -----------------------------------------------
|              |=================================> |  String typing                                |
|              |                                    -----------------------------------------------
 --------------

- Developer can define the structure of the data that they want to expose using types and schemas
- Also define how you can interact with the data (creating, updating, deleting) by using queries and mutations
- Possible to fetch data in the real-time by using subscriptions, a feature in certain GraphQl client (like Apollo and Graphcool)

### GraphQl Features
- **Hierarchical queries** - A client defines what response they want and what iot should look like, and the response data will automatically resemble what the client has requested
- **Introspective** - With this feature, the client is able to know exactly which features are supported, the fields required and what sort of results can be returned. It can also act as a pre-written documentation for the api.
- **Strongly typed** - The presence of a type system allows for synatactic query validation and the server responds with appropriate error messages. Clients also nows exactly what parameters to give and what the response will look like 
- **client specified queries** - The client decides which data they want through different fields n the queries. Only the requested fields will be returned by the server. You never over-fetch or under-fetch the data which makes graphql so efficient.



### Schemas and Types
Using Schemas and Types we can tell graphql what does our data looks like.
Schema defines what data/fields would be returned from the api.
```
type Author {
  id: ID!
  info: Person
}
type Person {
  name: String!
  age: Int
  gender: String
}
```
GraphQl comes with a set of default scalar types: Float, Int, String, Boolean, ID.
Interfaces are abstract types that cna be implemented by other types.
```
interface Shared {
  id: ID!
  name: String
}
type Dog implements Shared {
  id: ID!
  name: String
  breed: String
}
type Person implements Shared {
  id: ID!
  name: String
  height: Int
  age: Int
}
```

### Resolvers
Resolvers are the functions that actually fetch the data from the database.
Schema describes the structure of the queries while the resolvers provides he actual functionality.

In Apollo GraphQl, resolver function takes the following format:
`fieldName(obj, args, context, info) { result }`
- fieldName - Name of the resolver function which should match the field in the schema
- obj - contains the result returned by the parent field
- args - holds the arguments passed into the query
- context - holds the pre-request state like authentication information that should be considered while resolving the query
- info - contains information about the execution state of the query and should only be used in advanced cases
Note: if you use queries that don't use arguments then you don't have to provide any of these parameter.


### Queries
Queries define the fields, arguments, and result types. We are going to use a few tools from apollo graphql
- graphql-tool - provide helper function for stitching together the schema and the resolvers
- apollo-server-express - connects grapgql to the express servers
```
npm install graphql-tools apollo-server-express graphql core-js
```

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
Pass below query to see the data returned
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