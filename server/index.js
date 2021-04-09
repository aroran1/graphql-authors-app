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

const app = express();

app.use('/graphql', (req, res) => {
  res.send('Welcome to our Authors App!'); // test it on http://localhost:3000/graphql
})

app.listen(port, () => {
  console.log(`Server is listening to ${port}!`)
});