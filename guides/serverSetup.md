# Server setup and Queries
Queries are generally the GET oprations.

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

## Named Query
Note that you can change the resolver name to anything as long as it matches the query operation name but if you neame it somelike liek `k` the it'll not make much sense in the code. For that type of instance you can make your query as names query with type query operation name as anything.
```
// code - server/index.js
const tyepDefs = `type Query { k: [Authors]}`
const resolvers = { Query: { k: () => authors } }

// Playground
query getAuthors {
  k {
    info {
      name
    }
  }
}

// OUTPUT
{
  "data": {
    "k": [
      {
        "info": {
          "name": "Joe Kelly"
        }
      },
      {
        "info": {
          "name": "Mary Jane"
        }
      }
    ]
  }
}

```  

## Get a specific author Query
- Create a new query operation as `getAuthor` with id
```
type Query {
    getAuthors: [Author],
    getAuthor(id: ID): Author 
  }
``` 
- Add a new resolver for that query
```
const resolvers = {
  Query: {
    getAuthors: () => authors, // returns array of authors
    getAuthor: (obj, { id }) => authors.find(author => author.id === id)  // returns an author object
  }
}
```
- Test
```
// Playground
query {
  getAuthor(id: "1") {
    id
    info {
      name
      age
    }
  }
}

// Output
{
  "data": {
    "getAuthor": {
      "id": "1",
      "info": {
        "name": "Joe Kelly",
        "age": 32
      }
    }
  }
}
```

## Arguments as variables
We can supply the arguments as variables (instead of passing a static value) which means we can keep our query the same no matter the variables we pass along and because we pass them separatly our client side code can remain the same.
```
// Playground
query ($authorId: ID!){
  getAuthor(id: $authorId) {
    id
    info {
      name
      age
    }
  }
}

// QUERY VARIABLES passed in the playground
{
  "authorId": "2"
}

// Output
{
  "data": {
    "getAuthor": {
      "id": "2",
      "info": {
        "name": "Mary Jane",
        "age": 27
      }
    }
  }
}
```

## Query Aliases (duplicated query)
If we want to request 2 authors with the same field at the same time will end up with an error response.

GraphQl doesn't permits querying or the same field with different arguments. `Error due to conflicting fields` || `Variable \"$authorIdB\" is never used.`
The response is in JSON and in JSON you can not have 2 elements with the same key.

```
// Playground
query ($authorIdA: ID!, $authorIdB: ID!){
  getAuthor(id: $authorId) {
    id
    info {
      name
      age
    }
  }
}
// QUERY VARIABLES passed in the playground
{
  "authorIdA": "1",
  "authorIdB": "2"
}
// OUTPUT
{
  "error": {
    "errors": [
      {
        "message": "Variable \"$authorIdB\" is never used.",
```
Note if you just pass the 2 queries with the original setup, graphql will return the data of the last requested query.

You can request the data for 2 different authors by passing the name aliases  and data will be returned against those aliases as keysto the query as below:
```
// Playground
query ($authorIdA: ID!, $authorIdB: ID!){
  author1: getAuthor(id: $authorIdA) {
    id
    info {
      name
      age
    }
  },
  author2:  getAuthor(id: $authorIdB) {
    id
    info {
      name
      age
    }
  }
}
// QUERY VARIABLES passed in the playground
{
  "authorIdA": "1",
  "authorIdB": "2"
}
// OUTPUT
{
  "data": {
    "author1": {
      "id": "1",
      "info": {
        "name": "Joe Kelly",
        "age": 32
      }
    },
    "author2": {
      "id": "2",
      "info": {
        "name": "Mary Jane",
        "age": 27
      }
    }
  }
}
```

## Fragments
The above `query aliases` resolves the problem for getting data of 2 different authors but we have to duplicate the code. We can avoid repeating the same fields for athors by creating signular fragments on the returned type. This is particularly useful when we are reteriving many records.

```
// Playground
query ($authorIdA: ID!, $authorIdB: ID!){
  author1: getAuthor(id: $authorIdA) {
    ...authorInfo
  },
  author2:  getAuthor(id: $authorIdB) {
    ...authorInfo
  }
}
// fragment created just underneath the query in the playground
fragment authorInfo on Author {
  id
  info {
    name
    age
  }
}
// QUERY VARIABLES passed in the playground
{
  "authorIdA": "1",
  "authorIdB": "2"
}
// OUTPUT
{
  "data": {
    "author1": {
      "id": "1",
      "info": {
        "name": "Joe Kelly",
        "age": 32
      }
    },
    "author2": {
      "id": "2",
      "info": {
        "name": "Mary Jane",
        "age": 27
      }
    }
  }
}
```

**Inline Fragments**
Fragments can also be inline but the downside is we can't reuse them.
- Inline Fragments allows to query for specific properties on specific types.
- Not as flexible as they can't be reused like regular fragments
```
query ModeOfTransport {
  transportMode {
    name
    ... on Animal {
      numberOfLegs
    }
    ... on Locomotive {
      numberOfWheels
    }
  }
}
```

## Directives
GraphQl provides two inbuilt directives hat allows us to either include or skip one fields our results:
- skip directive - @skip
- include directive - @include

### Skip
We can retrieve our data but skip the age field for our first author if `skipAge` variable is set to true but the same value would eb available for the second data.

```
// Playground
query ($authorIdA: ID!, $authorIdB: ID!, $skipAge: Boolean!){
  author1: getAuthor(id: $authorIdA) {
    id
    info {
      name
      age @skip(if: $skipAge)
    }
  },
  author2:  getAuthor(id: $authorIdB) {
    id
    info {
      name
      age
    }
  }
}
// QUERY VARIABLES passed in the playground
{
  "authorIdA": "1",
  "authorIdB": "2",
  "skipAge": true
}
// OUTPUT
{
  "data": {
    "author1": {
      "id": "1",
      "info": {
        "name": "Joe Kelly"
      }
    },
    "author2": {
      "id": "2",
      "info": {
        "name": "Mary Jane",
        "age": 27
      }
    }
  }
}
```

### Include
Same as skip directive we can use include optionally if the `includeGender` variable is set to true

```
// Playground
query ($authorIdA: ID!, $authorIdB: ID!, $includeGender: Boolean!){
  author1: getAuthor(id: $authorIdA) {
    id
    info {
      name
      age
    }
  },
  author2:  getAuthor(id: $authorIdB) {
    id
    info {
      name
      age
      gender @include(if: $includeGender)
    }
  }
}
// QUERY VARIABLES passed in the playground
{
  "authorIdA": "1",
  "authorIdB": "2",
  "skipAge": true
}
// OUTPUT
{
  "data": {
    "author1": {
      "id": "1",
      "info": {
        "name": "Joe Kelly",
        "age": 32
      }
    },
    "author2": {
      "id": "2",
      "info": {
        "name": "Mary Jane",
        "age": 27,
        "gender": "F"
      }
    }
  }
}
```

## Mutation
Queries in GraphQL are synonymous with GET request in traditional REST API's. Mutation on the other hand are like these REST operations: 
- POST
- PUT
- PATCH
- DELETE

### POST / Create Mutation
To create a new author we need to do as we did with queries:
- Craete a new mutation type in the `typeDefs`
```
const typeDefs = `
  ...
  type Mutation {
    createAuthor(name: String!, gender: String!): Author
  }
`;
```
- craete a new object and a resolver for the mutation
```
const resolvers = {
  Query: {
    getAuthors: () => authors, // returns array of authors
    getAuthor: (obj, { id }) => authors.find(author => author.id === id)  // returns an author object
  },
  Mutation: {
    createAuthor: (obj, args) => {
      const id = String(authors.length + 1);
      const {name, gender} = args;
      const newAuthor = {
        id,
        info: {
          name,
          gender
        }
      }
      authors.push(newAuthor);
      return newAuthor;
    }
  }
}
```
- Test
```
// Playground
mutation craeteNewAuthor($authorName: String!, $authorGender: String!) {
  createAuthor(name: $authorName, gender: $authorGender) {
    id
    info {
      name
      gender
    }
  }
}
// QUERY VARIABLES passed in the playground
{
  "authorName": "J.K Rowling",
  "authorGender": "F"
}
// OUTPUT
{
  "data": {
    "createAuthor": {
      "id": "3",
      "info": {
        "name": "J.K Rowling",
        "gender": "F"
      }
    }
  }
}
```

### PUT, PATCH / Update Mutation
Same as above create mutation we could also create mutation to update existing data
Note: only id is requires as user can update other values.
```
const typeDefs = `
  ...
  type Mutation {
    createAuthor(name: String!, gender: String!): Author,
    updateAuthor(id: ID!, name: String, gender: String, age: Int): Author 
  }
`;
const resolvers = {
  Query: {...},
  Mutation: {
    createAuthor: (obj, args) => {...},
    updateAuthor: (obj, {id, name, gender, age}) => {
      const author = authors.find(author => author.id === id)

      if(author) {
        const authorIndex = authors.indexOf(author)
        if(name) author.info.name = name
        if(gender) author.info.gender = gender
        if(age) author.info.age = age

        authors[authorIndex] = {id, info: author.info}
        return {id, infor: author}
      } else {
        throw new Error('Author ID not found!');
      }
    }
  }
}
// Playground
mutation updateAuthor($id: ID!,$name: String, $gender: String, $age: Int) {
  updateAuthor(id:$id, name: $name, gender: $gender, age: $age) {
    id
    info {
      name
      age
      gender
    }
  }
}
// QUERY VARIABLES passed in the playground
{
  "id": "2",
  "name": "F.Y Bowling",
  "gender": "F",
  "age": 20
}
// OUTPUT
{
  "data": {
    "updateAuthor": {
      "id": "2",
      "info": {
        "name": "F.Y Bowling",
        "age": 20,
        "gender": "F"
      }
    }
  }
}

```

### Delete Mutation
```
const typeDefs = `
  ...
  type DeleteMessage {
    id: ID!
    message: String
  }
  type Query {...}
  type Mutation {
    createAuthor(name: String!, gender: String!): Author,
    updateAuthor(id: ID!, name: String, gender: String, age: Int): Author,
    deleteAuthor(id: ID!) : DeleteMessage
  }
`;
const resolvers = {
  Query: { ... },
  Mutation: {
    createAuthor: (obj, args) => {
      ...
    },
    updateAuthor: (obj, {id, name, gender, age}) => {
      ...
    },
    deleteAuthor: (obj, { id }) => {
      const author = authors.find(author => author.id === id)
      if(author) {
        const authorIndex = authors.indexOf(author)
        authors.splice(authorIndex, 1)
        return {id, message: 'Author with id ${id} is deleted successfully!'}
      } else {
        throw new Error('Author ID not found!');
      }
    }
  }
}
// ``````p``````layground
mutation deleteAuthor($id: ID!) {
  deleteAuthor(id:$id) {
    id
    message
  }
}
// QUERY VARIABLES passed in the playground
{
  "id": "1"
}
// OUTPUT
{
  "data": {
    "deleteAuthor": {
      "id": "1",
      "message": "Author with id ${id} is deleted successfully!"
    }
  }
}
```