// @flow
import React, { Fragment } from 'react';
import { CssBaseline, Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import type { Node } from 'react';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import ConfirmButton from './ConfirmButton';
import DisplayStatus from '../DisplayStatus';
import routes from '../../routes';
import logo from '../../images/logo.png';

type Props = {
  handleSubmit: Function,
  status: string,
};

const SignIn = ({ handleSubmit, status }: Props): Node => (
  <Fragment>
    <CssBaseline />
    <Paper className="paper">
      <img src={logo} className="logo" alt="logo" />
      <Typography variant="headline" align="center">
        Sign in
      </Typography>
      <form
        className="form"
        onSubmit={event => {
          event.preventDefault();
          const user = event.target.elements.email.value;
          const pass = event.target.elements.password.value;
          handleSubmit(user, pass);
        }}
      >
        <EmailInput />
        <PasswordInput />
        <ConfirmButton />
        <DisplayStatus status={status} />
        <Link to={routes.SIGNUP} className="signup">
          Create Account
        </Link>
      </form>
    </Paper>
  </Fragment>
);

export default SignIn;
