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

module.exports = typeDefs;