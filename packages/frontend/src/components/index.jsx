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
    loader={() => import(/* webpackChunkName: "Dashboard" */ './Dashboard/')}
  />
);
const CreditCardAdd = () => (
  <CreateLoadable
    loader={() =>
      import(/* webpackChunkName: "CreditCardAdd" */ './Dashboard/AccountInfo/CreditCardAdd/')
    }
  />
);
const CarSeatSet = () => (
  <CreateLoadable
    loader={() =>
      import(/* webpackChunkName: "CarSeatSet" */ './Dashboard/AccountInfo/CarSeatSet/')
    }
  />
);

const App = (): Node => (
  <HashRouter>
    <Fragment>
      <Header />
      <Route path={`(${routes.HOME}|${routes.SIGNUP})`} component={SignIn} />
      <Route path={routes.DASHBOARD} component={Dashboard} />
      <Route path={routes.CREDITCARD_ADD} component={CreditCardAdd} />
      <Route path={routes.CARSEATS_SET} component={CarSeatSet} />
    </Fragment>
  </HashRouter>
);

export default hot(module)(App);
