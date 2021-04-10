const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const port = process.env.PORT || 3000;

// Some fake data - usually this will come from database
const authors = [
  {
    id: "1",
    info: {
      name: "Joe Kelly",
      age: 32,
      gender: "M",
    }
  },
  {
    id: "2",
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
  type DeleteMessage {
    id: ID!
    message: String
  }
  type Query {
    getAuthors: [Author],
    getAuthor(id: ID): Author 
  }
  type Mutation {
    createAuthor(name: String!, gender: String!): Author,
    updateAuthor(id: ID!, name: String, gender: String, age: Int): Author,
    deleteAuthor(id: ID!) : DeleteMessage
  }
`;
// Note in typeDefs > Mutation > updateAuthor > only id is requires as user can update other values

// resolvers
// resolvers is the code that makes things happen
// when someone calls the query method we will run the resolver with the same name (which has to be identical)
// that's how graphql know which code to run for which query
// rest is taken care by our apollo server, it makes sure that right typeDefs are linked with right resolver
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
    },
    updateAuthor: (obj, {id, name, gender, age}) => {
      const author = authors.find(author => author.id === id)

      if(author) {
        const authorIndex = authors.indexOf(author)
        if(name) author.info.name = name
        if(gender) author.info.gender = gender
        if(age) author.info.age = age

        authors[authorIndex] = {id, info: author}
        return {id, info: author.info}
      } else {
        throw new Error('Author ID not found!');
      }
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