import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Container } from 'react-bootstrap';
import { AppHeader, Home, Register } from './sections';

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
          </Switch>
        </Container>
      </Router>
    </>
  );
}

export default App;
