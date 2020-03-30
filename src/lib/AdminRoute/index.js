import React, { useContext } from "react";
import {
  Route,
  Redirect,
} from "react-router-dom";
import { AuthContext } from '../../AuthContext/authContext';

export function AdminRoute({ children, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && (user.role === "ADMIN" || user.role === "SUPERADMIN") ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}