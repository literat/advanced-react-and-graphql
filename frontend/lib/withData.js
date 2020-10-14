import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { endpoint, prodEndpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    // local data
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            // read the cartOpen value from the cache
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY,
            });
            // Write the Cart state to the opposite
            const data = {
              data: { cartOpen: !cartOpen },
            };
            cache.writeData(data);

            return data;
          },
        },
      },
      defaults: {
        cartOpen: false,
      },
    },
  });
}

function renderPage({Page, props}) {
  return (
    <ApolloProvider client={props.apollo}>
      <Page {...props} />
    </ApolloProvider>
  );
}

export default withApollo(createClient, { render: renderPage });
