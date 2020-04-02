// store.js
import React, { createContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { LoadingComponent } from '../lib/';

const GETME = gql`
  {
    getMe {
      firstName
      lastName
      email
      role
      verified
    }
  }
`;

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [appLoading, setAppLoading] = useState(true);
  const { loading, refetch } = useQuery(GETME, {
    onCompleted: (data) => {
      if (data && data.getMe) {
        setUser(data.getMe);
      }
      setAppLoading(false);
    },
    onError: () => {
      setUser(null);
      setAppLoading(false);
    },
    fetchPolicy: "cache-and-network"
  });

  const defaultContext = {
    user,
    setUser,
    setAppLoading,
    refetch
  };

  if (loading || appLoading) return <LoadingComponent />

  // const [state, dispatch] = useReducer(reducer, initialState);

  return <AuthContext.Provider value={defaultContext}>{children}</AuthContext.Provider>;
};

