import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client';
import { toast } from 'react-toastify';

export const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ networkError }) => {
      if (networkError) {
        toast("Network error", {
          type: "error"
        });
      }
    }),
    createUploadLink({ uri: '/graphql', credentials: 'include' }),
  ]),
  cache: new InMemoryCache(),
  defaultHttpLink: false
});