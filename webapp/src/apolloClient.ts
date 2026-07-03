import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_API_URL,
    headers: {
      'x-api-key': import.meta.env.VITE_GRAPHQL_API_KEY,
    },
  }),
  cache: new InMemoryCache(),
})
