const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

app.use('/graphql', (req, res) => {
  res.send('Welcome to our Authors App!'); // test it on http://localhost:3000/graphql
})

app.listen(port, () => {
  console.log(`Server is listening to ${port}!`)
});