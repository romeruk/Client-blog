import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {
  AppHeader,
  Home,
  Register,
  LogIn,
  NotFound,
  CreateUserByAdmin,
  UsersList,
  Categories,
  CreateCategory,
  Footer,
  EditMe,
  ForgottenPassword,
  ResetPasswordByToken,
  VerifyUser,
  CreatePost,
  MyPosts,
  EditMyPost,
  Posts,
  ReadPost
} from './sections';
import { AdminRoute, PrivateRoute } from './lib';

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
            <Route exact path="/forgottenpassword">
              <ForgottenPassword />
            </Route>
            <Route exact path="/resetpassword/:token">
              <ResetPasswordByToken />
            </Route>
            <Route exact path="/verify/:token">
              <VerifyUser />
            </Route>
            <Route exact path="/read/:slug">
              <ReadPost />
            </Route>
            <PrivateRoute exact path="/user/edit">
              <EditMe />
            </PrivateRoute>
            <PrivateRoute exact path="/user/post/create">
              <CreatePost />
            </PrivateRoute>
            <PrivateRoute exact path="/user/post/:slug/edit">
              <EditMyPost />
            </PrivateRoute>
            <PrivateRoute exact path="/user/posts">
              <MyPosts />
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
            <AdminRoute exact path="/posts">
              <Posts />
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
