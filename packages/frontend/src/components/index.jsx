// @flow
import '../styles/global.css';
import React, { Fragment } from 'react';
import type { Node } from 'react';
import { hot } from 'react-hot-loader';
import { HashRouter, Route } from 'react-router-dom';
import CreateLoadable from './CreateLoadable';
import Header from './Header';
import routes from '../routes';

const SignIn = () => (
  <CreateLoadable
    loader={() => import(/* webpackChunkName: "SignIn" */ './SignIn')}
  />
);
const Dashboard = () => (
  <CreateLoadable
    loader={() => import(/* webpackChunkName: "Dashboard" */ './Dashboard')}
  />
);

const App = (): Node => (
  <HashRouter>
    <Fragment>
      <Header />
      <Route path={`(${routes.HOME}|${routes.SIGNUP})`} component={SignIn} />
      <Route path={routes.DASHBOARD} component={Dashboard} />
    </Fragment>
  </HashRouter>
);

export default hot(module)(App);
