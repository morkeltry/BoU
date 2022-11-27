import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { StartPage, RegisterPage, BuyerPage, ClaimPage, Home, About } from './containers';

// Don't forget to add extra pages in index.js!

const Routes = () => (
  <Switch>
    <Route exact path="/" component={ StartPage } />
    <Route path="/register" component={ RegisterPage}  />
    <Route path="/claim" component={ ClaimPage }  />
    <Route path="/buyer" component={ BuyerPage } />
  </Switch>
);

export default Routes;
