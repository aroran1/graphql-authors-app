# Prisma

[Prisma](https://www.prisma.io/) is a similar tool as graphcool to conver your database directly into an API for better and faster devvelopments. It comes with more features and flexibility then graphcool.

- Prisma conversta database into API that you can consume directly and extend its functionality
- Allows o define  application layer above Prisma API
- Supports MySQL d Prostgres SQL databases
- CLI can be used to modify or deploy Prisma services
- imilar to Graphcool th some additional features and more flexibility

## Prisma Database folder
- datamodel.graphql - Forms the basis on which our database will be created and he API generation of the methods in `src/enerated/risma.graphql`
- prisma.yml - A configuration file that defines the service name, deployment information, and other information including authentication and database seed data
- seed.grapgql - seed data is the sample data that gets pre-populated into our database on initial deployment

## Install
`npm install -g prisma graphql-cli`

## create project
`graphql create prisma-books -b node-basic` - doesn't work anymore
instead try this https://blog.logrocket.com/creating-a-node-js-graphql-server-using-prisma-2/


## create project with Prisma
or run `prisma init` which will generate a prisma folder with prisma/schema.prisma
```
✔ Your Prisma schema was created at prisma/schema.prisma.
  You can now open it in your favorite editor.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql or sqlite.
3. Run prisma db pull to turn your database schema into a Prisma data model.
4. Run prisma generate to install Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started
    
```
OR
## create project with Graphql cli
You can start a project  y running `graphql init` (naming the project `graphql-cli-books`) which will give you below options to choose what type of project you wnat to create.
- apollo-fullstack-react-postgres-ts:
Apollo GraphQL Server connecting to Postgres database and React client using TypeScript

- apollo-fullstack-react-mongo-ts: 
Apollo GraphQL Server connecting to Mongo database and React client using TypeScript

- apollo-mongo-server-ts: 
Apollo GraphQL Server connecting to Mongo database using TypeScript

- apollo-mongo-datasync-server-ts: 
Apollo GraphQL Server connecting to Mongo database using TypeScript. Contains Data Synchronization features.

- apollo-postgres-server-ts: 
Apollo GraphQL Server connecting to Postgres database using TypeScript