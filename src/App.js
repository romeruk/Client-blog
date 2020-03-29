import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Container } from 'react-bootstrap';
import { AppHeader, Home, Register, LogIn, NotFound } from './sections';
import { PrivateRoute } from './lib';

function App() {
  return (
    <>
      <Router>
        <AppHeader />
        <Container>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/signup">
              <Register />
            </Route>
            <Route exact path="/signin">
              <LogIn />
            </Route>
            <PrivateRoute path="/protected">
            //private route
            </PrivateRoute>
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
