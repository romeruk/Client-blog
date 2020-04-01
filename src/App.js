import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { AppHeader, Home, Register, LogIn, NotFound, CreateUserByAdmin, UsersList, Categories, CreateCategory, Footer, EditMe } from './sections';
import { AdminRoute, PrivateRoute } from './lib';
import { EditCategory } from './sections/Admin/EditCategory';

function App() {
  return (
    <>
      <Router>
        <div id="page-content">
          <AppHeader />
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
            <PrivateRoute exact path="/user/edit">
              <EditMe />
            </PrivateRoute>
            <AdminRoute exact path="/users">
              <UsersList />
            </AdminRoute>
            <AdminRoute exact path="/users/create">
              <CreateUserByAdmin />
            </AdminRoute>
            <AdminRoute exact path="/categories">
              <Categories />
            </AdminRoute>
            <AdminRoute exact path="/categories/create">
              <CreateCategory />
            </AdminRoute>
            <AdminRoute exact path="/categories/:slug/edit">
              <EditCategory />
            </AdminRoute>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
