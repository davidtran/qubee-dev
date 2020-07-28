import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import  { createUploadLink } from 'apollo-upload-client';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('JWT_STORAGE_KEY');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    onError(({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors);
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);

      if (graphQLErrors && graphQLErrors[0] && graphQLErrors[0].extensions.code === "UNAUTHENTICATED") {
        localStorage.removeItem('JWT_STORAGE_KEY');
        if (window.location.pathname.startsWith('/auth') === false) {
          window.location.href = '/auth/login';
        }
      }
    }),
    createUploadLink({
      uri: process.env.REACT_APP_GRAPHQL_URL,
      credentials: 'same-origin',
    }),
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

export default client;