import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Container } from 'react-bootstrap';
import { AppHeader, Home, Register, LogIn, NotFound, CreateUserByAdmin, UsersList } from './sections';
import { AdminRoute } from './lib';

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
            <AdminRoute exact path="/createuser">
              <CreateUserByAdmin />
            </AdminRoute>
            <AdminRoute exact path="/listusers">
              <UsersList />
            </AdminRoute>
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
