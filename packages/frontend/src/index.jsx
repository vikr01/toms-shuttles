// @flow
import React from 'react';
import { render } from 'react-dom';
import App from './components';

const title = process.env.TITLE;
const root = (process.env: any).REACT_ROOT;

const rootDOM: ?HTMLElement = document.getElementById(root);

if (!rootDOM) {
  throw new Error(`Element with id ${root} was not found.`);
}

render(<App title={title} />, rootDOM);
