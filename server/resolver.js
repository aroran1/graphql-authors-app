const authors = require('./authors');

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

module.exports = resolvers;