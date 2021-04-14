# GraphQL With React
Integrating GraphQL with Client Side Applications using Apollo Client

- Create a client application in ReactJS
- Connect the client application with our GraphQL API with APollo client
- Update the user interface sing optimistic updates

Taking base from [https://github.com/kimobrian/React-Setup.git](https://github.com/kimobrian/React-Setup.git)
run `cd React-Setup` && `npm install` && `npm run start`

Throws below error:
```
>> React-Setup % npm run start                                         

> start
> ./node_modules/.bin/webpack-dev-server --progress

/Users/nidhiarora/.Trash/React-Setup 18-37-08-620/React-Setup/node_modules/webpack-cli/bin/config-yargs.js:89
				describe: optionsSchema.definitions.output.properties.path.description,
				                                           ^

TypeError: Cannot read property 'properties' of undefined

```

## Aollo Client
- Ultra-flexible , GraphQL client for react, Javascript and native platforms
- Automatically takes care of a lot of complex and difficult implementations
- it takes care of all requests, including tracking loading states and errors
- Caches data locally and increases he speed of the application with very little configurations

Run prsima-books on a local server
`npm install apollo-client apollo-cache-inmemory apollo-link-http react-apollo graphql-tag graphql`

```
// craete a component with data and pass that component with the <Route ... component={ ItemListWithData  } />
//  import ItemListWithData from "../components/ItemList"; - craete a component with data
import { ApolloClient } from "apollo-client";
import { HttpLink} from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory"; // makes sure if the same data request goes twice only first will get to api the secone one will return the data from the cache
import { ApolloProvider } from "react-apollo"; // ApolloProvider is like a context provider for React, it allows us to access apollo client from anywhere in our components tree

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000' }), // path to your local graphQL server
  cache: InMemoryCache
})
var store = configureStore();

const routes = (
  <Provider store={ store }>
    <MuiThemeProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div>
            <Links />
            <Switch>
              <Route exact path="/" component={ ItemList } />
              <Route path="/item/:id" component={ Details } />
              <Route path="/item" component={ TestComponent } />
            </Switch>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    </MuiThemeProvider>
  </Provider>
);
```
Note: make sure how ApolloProvider works with React Provider