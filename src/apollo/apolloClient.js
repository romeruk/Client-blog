
import ApolloClient from "apollo-boost";
import { toast } from 'react-toastify';

export const client = new ApolloClient({
  credentials: 'include',
  uri: '/graphql',
  onError({ networkError }) {
    if (networkError) {
      toast("Network error", {
        type: "error"
      });

      console.log(`[Network error]: ${networkError}`);
    }
  }
});