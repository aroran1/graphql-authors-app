
# Apollo Server vs Express GraphQl
[https://stackoverflow.com/questions/58593497/what-is-the-difference-between-apollo-server-and-express-graphql#:~:text=Express%2DGraphQL%20is%20a%20piece,and%20parse%20the%20GraphQL%20queries.](https://stackoverflow.com/questions/58593497/what-is-the-difference-between-apollo-server-and-express-graphql#:~:text=Express%2DGraphQL%20is%20a%20piece,and%20parse%20the%20GraphQL%20queries.)
Performance: [https://dev.to/yeeiodev/differences-between-express-graphql-apollo-and-graphql-yoga-3m82](https://dev.to/yeeiodev/differences-between-express-graphql-apollo-and-graphql-yoga-3m82)


You should use apollo-server-express if:
- You want to take advantage of one or more of its built-in features like data sources, response caching, tracing, etc.
- You want to utilize Apollo Federation
- You want to integrate with Apollo Engine
- You're not going to be handling a huge number of requests per second

You should use express-graphql if:
- You want to squeeze every bit of performance out of your server that you can
- There's not a lot of Apollo Server's built-in features that you want to take advantage of

Apollo Server arguably has more overhead when processing requests. More importantly, it doesn't offer a way to pass in a custom execute function -- that means you can't take advantage of libraries like graphql-jit to speed up your response time. That may or may not be important to you depending on the volume and the complexity of the queries you're handling.

[https://github.com/benawad/node-graphql-benchmarks](https://github.com/benawad/node-graphql-benchmarks) is a link to some excellent benchmarks that were put together by Ben Awad. You can fork the repo and run them yourself to see the difference.

Keep in mind, if you're already using makeExecutableSchema to build your schema, then migrating from express-graphql to apollo-server-express is pretty trivial if you change your mind later on.

EDIT: For what it's worth, after some additional poking around Apollo Server's source code, I did find an undocumented executor option that can be used to provide a different execute function for Apollo Server to use, although that will only impact queries and mutations. The execute function passed to the underlying SubscriptionServer instance will always be the one from the graphql module.