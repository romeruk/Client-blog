import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Container } from 'react-bootstrap';
import { AppHeader, Home, Register, LogIn, NotFound, CreateUserByAdmin, UsersList, Categories } from './sections';
import { AdminRoute } from './lib';
import { EditCategory } from './sections/Admin/EditCategory';

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
            <AdminRoute exact path="/categories">
              <Categories />
            </AdminRoute>
            <AdminRoute exact path="/categories/:slug/edit">
              <EditCategory />
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
