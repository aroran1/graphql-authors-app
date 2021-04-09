# graphql-authors-app

## Issues with existing api approaches:
- the technologies that allow client-server communication has evolved, the most common being SOAP and REST
- currently most pplications utilise REST dues to the difficulties asssociated learning and understanding SOAP protocol
- REST doesn't impose strict rules on how to implement APIs compared to SOAP
- Difficulties associated with clients specifying exactly what they want from server

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
npm install graphql-tools@^2.9.0 apollo-server-express@^2.0.0 graphql@^0.12.3
```