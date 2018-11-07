// @flow
import React, { Fragment } from 'react';
import { CssBaseline, Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import type { Node } from 'react';
import UsernameInput from './UsernameInput';
import PasswordInput from './PasswordInput';
import ConfirmButton from './ConfirmButton';
import DisplayStatus from '../DisplayStatus';
import routes from '../../routes';
import logo from '../../images/logo.png';
import bgurl from '../../images/background.jpg';

type Props = {
  handleSubmit: Function,
  status: string,
};

const SignIn = ({ handleSubmit, status }: Props): Node => (
  <Fragment>
    <div
      style={{
        backgroundImage: `url(${bgurl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '800px',
      }}
    >
      <CssBaseline />
      <div style={{ height: '50px' }} />
      <Paper className="paper">
        <img src={logo} className="logo" alt="logo" />
        <Typography variant="h5" align="center">
          Sign in
        </Typography>
        <form
          className="form"
          onSubmit={event => {
            event.preventDefault();
            const user = event.target.elements.username.value;
            const pass = event.target.elements.password.value;
            handleSubmit(user, pass);
          }}
        >
          <UsernameInput />
          <PasswordInput />
          <ConfirmButton />
          <DisplayStatus status={status} />
          <Link to={routes.SIGNUP} className="signup">
            Create Account
          </Link>
        </form>
      </Paper>
    </div>
  </Fragment>
);

export default SignIn;
