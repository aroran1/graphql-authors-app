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