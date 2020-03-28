import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AppHeader, Home, Register, LogIn, NotFound, NetWorkError } from './sections';
import { useEffect } from 'react';
import { LoadingComponent } from './lib';

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

function App() {
  const { loading, data } = useQuery(GETME);
  const [user, setUser] = useState(null);


  useEffect(() => {
    if (data) {
      setUser(data.getMe);
    }
  }, [data]);

  if (loading) return <LoadingComponent />

  return (
    <>
      <Router>
        <AppHeader user={user} setUser={setUser} />
        <Container>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/signup">
              <Register user={user} />
            </Route>
            <Route exact path="/signin">
              <LogIn user={user} setUser={setUser} />
            </Route>
            <Route path="/network-error">
              <NetWorkError />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Container>
      </Router>
    </>
  );
}

export default App;
