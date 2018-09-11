// @flow
import '../styles/global.css';
import React from 'react';
import type { Node } from 'react';
import { hot } from 'react-hot-loader';
import { HashRouter as Router } from 'react-router-dom';
// import routes from '../routes';

type Props = {
  title: string,
};

const App = ({ title }: Props): Node => (
  <Router>
    <div>
      {title}

      {/* <Router /> */}
    </div>
  </Router>
);

export default hot(module)(App);
