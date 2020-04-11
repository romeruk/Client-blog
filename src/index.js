import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { Router, Route } from "react-router";
import { createBrowserHistory } from "history";
import { toast } from 'react-toastify';
import { QueryParamProvider } from 'use-query-params';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'braft-editor/dist/index.css'
import './style.css';
import App from './App';
import { client } from "./apollo/apolloClient";
import * as serviceWorker from './serviceWorker';
import { AuthProvider } from './AuthContext/authContext';
const history = createBrowserHistory();


toast.configure({
  position: "bottom-right"
});

ReactDOM.render(
  <Router history={history}>
    <QueryParamProvider ReactRouterRoute={Route}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ApolloProvider>
    </QueryParamProvider>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
