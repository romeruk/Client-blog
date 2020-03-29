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
  const [pageLoading, setPageLoading] = useState(true);
  const { loading } = useQuery(GETME, {
    onCompleted: (data) => {
      if (data && data.getMe) {
        setUser(data.getMe);
      }
      setPageLoading(false);
    },
    onError: () => {
      setUser(null);
      setPageLoading(false);
    }
  });

  const defaultContext = {
    user,
    setUser
  };

  if (loading || pageLoading) return <LoadingComponent />

  // const [state, dispatch] = useReducer(reducer, initialState);

  return <AuthContext.Provider value={defaultContext}>{children}</AuthContext.Provider>;
};

