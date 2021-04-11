# Realtime Graphql

Realtime is becoming more popular
- Increasingly becomeing the norms and very popular with developers, users don't want to wait or keep refreshing to receive new data. they want to use it as soon as its available.
- Realtime data can reduce the size of responses meaning very fast application that requires ery little bandwidth compared to REST
- The realtime is supported by Apollo Graphql and Express Graphql by subscriptions to push data to the client
  - [Express Graphql example](https://www.smashingmagazine.com/2018/12/real-time-app-graphql-subscriptions-postgres/)

## PubSub
Apollo package `apollo-server-express` exposes the pubsub class (Publish-Subscribe) to handle realtime.

Client can subscribe to those topics and our application then can publish events to those topics. Once the event is pusblished, all the clients that has subscribed to it will be instantly notified. To publish this stream of event PubSub uses the async iterator to craete streams in javascript.

Subscriptions are same as Queries and Mutations, they also need to live in our resolver.js file.

- import `apollo-server-express` package to `server/resolver.js` file and create a new instance of pubsub
```
const { PubSub } = require('apollo-server-express');
const pubsub = new PubSub();
```
- Create a new file for constants as `server/constants.js` to store the subscription name. Store the name in a common place as the same name will be used for publishing and subscription. Storing such values in constants makes it easy to change on future without having to change the key name.
```
const SUBSCRIPTION = {
  AUTHORS_TOPIC: "newAuthor"
}

module.exports = {
  SUBSCRIPTION
}
```
- Update `server/schema.js` to support the Subscription
```
const typeDefs = `
  type Author {...}
  type Person {...}
  type DeleteMessage {...}
  type Query {
    ... 
  }
  type Mutation {
    ...
  },
  type Subscription {
    createAuthorWithSubscription: Author
  }
`;
```
- Add Subscription resolver to `server/resolver.js`
```
const resolvers = {
  Subscription: {
    Query: {...},
    Mutation: {...},
    createAuthorWithSubscription: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION.AUTHORS_TOPIC)
    }
  }
}
```
- Make sure to publish this subscription when a new author is created inside mutation resolver in `server/resolver.js`
```
const resolvers = {
  Query: {
    getAuthors: () => authors, // returns array of authors
    getAuthor: (obj, { id }) => authors.find(author => author.id === id)  // returns an author object
  },
  Mutation: {
    createAuthor: (obj, args) => {
      ...
      authors.push(newAuthor);
      
      pubsub.publish(SUBSCRIPTION.AUTHORS_TOPIC, { createAuthorWithSubscription: newAuthor });
      return newAuthor;
    },
  }
}
```
- Final things is to add websokets to our server. Websockets technology allows you to create an interactive session between the client and a server.
This is commonly used for realtime applications such as chat application. Without websockets a chat application's client would have to frequently ask the server of any updates / new messages which will waste bandwidth and server capacity but with web sockets a client can open up a connection with server and can keep it open. When as new message arrives, server can push that message over that open connection directly to the client.
Apollo server comes with web sockets available from the package we are using. This will ensure clients can subscribe to topics and they are notified in realtime when changes happen.
Websockets rely on native http package of node js so we need to import `createserver` from `http` inside `server/index.js`.

**createServer** - creates the server on node to get our machine to act as a server which can listen to requests and response
Using Node.js on the web generally involves a server framework, like Express, Hapi, or Koa which makes it easy to work with underlying HTTP framework.
In those case we are using both/all. First we are creating an express server and then we are creating apollo (containing graphql info) and passing the express server to apollo via middleware to use that.
Now creating node's http createServer to handle our requests and passing express server so it passes those incoming requests to express erver as well. 
`const httpServer = createServer(app);`
tell apollo server to install subscription handler and passing the httpServer to it
`server.installSubscriptionHandlers(httpServer)`
// Finally we making our httpServer listen to the port instead of the express server `app.listen(port, () => {`
httpServer.listen(port, () => {
  // console.log(`Server is listening to ${port}!`)
  console.log(`Server is listening to http://localhost:${port}${server.graphqlPath}`)
});

server/index.js
```
const { createServer} = require('http');

...
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer)
httpServer.listen(port, () => {
  console.log(`Server is listening to http://localhost:${port}${server.graphqlPath}`)
});
```
- Test
To test subscription, create a subscription in one tab as below and run it (this will stay open and keep listening). Then in another tab create mutation of `createAuthor` and run it as well. You'll see as soon as a new author is created successfully it'll automatically updates the subscript with the new data.
```
// Tab 1 - run it
subscription {
  createAuthorWithSubscription {
    id
    info {
      name
      age
      gender
    }
  }
}
// Tab 2
mutation createNewAuthor($authorName: String!, $authorGender: String!){
  createAuthor(name: $authorName, gender: $authorGender) {
    id
    info {
      name
      age
      gender
    }
  }
}
// Query Variables - run it
{
  "authorName": "Mia Arora",
  "authorGender": "F"
}
If this mutation is successful the it'll automatically pushed to tab 1 with the newAuthor's data

```

## Tools
Tools are big part of tech development.

### GraphQl Playground
- A tool very similar to GraphiQL but with some additional features
- More powerful query editor the GraphiQL, enables better devlopment workflows
- Additional features includes:
  - automatic schema reloading
  - tabs
  - support for realtime subscriptions
  - suppoer fot multiple projects and endpoints
Note: There is a desktop version of GraphiQL that has been developed using Electron JS that supports most of the features provided by GraphQL Playground.

### GraphQl Yoga
If the whole concept of creating Express application, connecting it with HTTP, and configuring subscription manually seems too much, then graphql-yoga is the solution
It is a complete GraphQL server that is easy to setup, has good performance and provides a great developwe experience straight out of the box.
graphql-yoga is based on the libraries we have been using so far:
- express/apollo-server - GraphQL engine and schema helpers
- graphql-subscriptions/subscriptions-transport-ws - GraphQL subscriptions server
- graphql.js/graphql-tools - Extensible web erver framework that provides all functionalities provided by the graphql-express-server
- graphql-playground - Interactive query editor that shows when you navigate to the browser (n alternative to GraphiQL)