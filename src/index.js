import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux";
import { Provider } from 'react-redux';
import { Auth0Provider } from "@auth0/auth0-react";



ReactDOM.render(
  <Auth0Provider
  domain="facture-1.eu.auth0.com"
  clientId={process.env.REACT_APP_AUTH0_CLIENT}
  redirectUri={process.env.REACT_APP_REDIRECT_URL}>
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
