# Graphql Yoga
`npm install graphql-yoga`
Graphql yoga makes the application and server setup all in one and by default it runs on port `4000`.

`yoga/server/index.js`
```
const { GraphQLServer, PubSub } = require('graphql-yoga');
var records = [];

const typeDefs = `
 type Query {
   fetchRecords: [String]
 }
 type Mutation {
  createRecord(recordData: String!): String!,
  updateRecord(recordIndex: Int!, recordName: String!): String!
 }
 type Subscription {
   newRecord: String
 }
`;

const RECORD_CHANNEL = 'RECORDS';
const resolvers = {
  Query: {
    fetchRecords: () => records
  },
  Mutation: {
    createRecord: (obj, { recordData }) => {
      records.push(recordData);
      pubsub.publish(RECORD_CHANNEL, { newRecord: recordData })
      return `New record created ${recordData}!`;
    },
    updateRecord: (obj, { recordIndex, recordName  }) => {
      if(records[+recordIndex] == undefined) { // + converts string number to int number if passed as a string
        throw new Error('Record does not exist!');
      }

      records[+recordIndex] = recordName;
      return `Record updated to ${recordName }!`;
    }
  },
  Subscription: {
    newRecord: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator(RECORD_CHANNEL)
      }
    }
  }
}

const pubsub = new PubSub();
const server = new GraphQLServer({typeDefs, resolvers, context: { pubsub }});
server.start(() => {
  console.log('Server is listening to port 4000!');
});
```

Test
```
mutation createRecord {
  createRecord(recordData: "Books")
}
// output
{
  "data": {
    "createRecord": "New record created Pens!"
  }
}

********
query getRecords {
  fetchRecords
}
// output
{
  "data": {
    "fetchRecords": [
      "Books"
    ]
  }
}

********
mutation updateRecords {
  updateRecord(recordIndex: 0, recordName: "Notepads")
}
// output
{
  "data": {
    "updateRecord": "Record updated to Notepads!"
  }
}
```