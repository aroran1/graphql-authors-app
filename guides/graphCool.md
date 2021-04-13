# GraphCool

- An opinionated tool to develop serverless GraphQL backends
- Turns your data into an API that you cna use directly
- It currently only supports MySQL databases, but plans are in the pipelien to support other databases
- The GraphCool CLI is used to manage graphQl services whose contents are defined in graphcool.yml servoice definition file. This offers tools to modify your local service definition and file structures as well as already deployed services.

## GraphCool Services
- Type definition - contains the graphql schemas and re divided into 2 sections
  - Model types - Types are to be stored in database and are annotated with the `@model` directive and represent pplication entities.
  - Transient types -  Types that represnts input or resturn types for API operations and are not persisted in the database


- Permission rules -  Determins which users can use which operations. WE can use the same rule for all operations by using a wildcard `*`.
  - Inculde a query property with a query taht should return a `Boolean`
  - Only authenticated users that satisfy the query in TODO.graphql can craete a TODO.


- Functions
  - Reacts to events, extend API funstionality and act as hooks
  - Must have type and handler properties
  - Functions are categorized into 3
    - Subscriptions
      - Invoke Function based events
      - Triggered on execution of successful mutations
      - Needs an additional query field
    - Resolvers
      - Extends existing CRUD APInd also used for authentication
      - need an additional schema property
    - Hooks
      - execute before or after an api operation has been executed
      - Mostly used to validate request data and format responses
      - Two types: opertaionBefore and opertaionAfter
      - Need to specify an additional operation field
    All of these 3 function types can call external APIs as handlers, in which case they se the webhook roperty under the handler
    Root tokens grant full access to all API features and are configured as a list of strings:
      - rootTokens: 
        - rootToken1
        - rootToken2

### Install
[https://www.npmjs.com/package/graphcool](https://www.npmjs.com/package/graphcool) `npm install -g graphcool`
- Run `graphcool init graphcool-books` to create a project
  - types.graphql - schema definitation for data model
  - graphcool.yml - configuration for graphcool tool - handles permissions permissions folder to authenticate
    - create a new 
  - src
    - hello.graphql - resolvers schema
    - hello.js - resolvers code
- `graphcool add-template graphcool/templates/auth/email-password` this will add new packges / files to support the requested template
  - bunch of pre-written templates are available from graphcool, ie `graphcool-books/src/email-password`
  - graphcool-books/graphcool.yml is updated with those added templates which also need uncommenting in the code
  - graphcool-books/types.graphql - same as above, merge the new commented type User with our original type User
- graphcool comes with easy deployment on cloud or via docker
  - for cloud run `graphcool deploy` and select below options:
    - select a cluster closest to your location so it can work faster and deploy faster
    ```
      Shared Clusters:
        ❯ shared-eu-west-1 
        shared-ap-northeast-1 
        shared-us-west-2 
    ```
    - Please choose the target name (prod) - hit enter to leave the environment name as `prod`
    - Please choose the service name (graphcool-books)  - hit enter to leave the service name as `graphcool-books`
    - Graph cool is no longer supported so it givies 404 on auth link :( https://www.graph.cool/
The above by defaults add the authentication and object relation to the db objects out of the box for your api.
Similar things are achieved by [Prima](https://www.prisma.io/) and its more flexible.
