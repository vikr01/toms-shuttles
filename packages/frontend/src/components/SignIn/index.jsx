// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import backendRoutes from 'toms-shuttles-backend/lib/routes';
import HttpStatus from 'http-status-codes';
import io from 'socket.io-client';
import ioEvents from 'toms-shuttles-backend/lib/io-events';
import Prompt from './Prompt';
import CreateAccount from '../CreateAccount';
import routes from '../../routes';

const socket = io();

const signupStatusEnums = {
  ok: 0,
  connection_error: 1,
  password_mismatch: 2,
  username_taken: 3,
  server_error: 4,
  error: 5,
  unknown: 6,
  default: 7,
};

function signupStatusToString(e: signupStatusEnums): string {
  switch (e) {
    case signupStatusEnums.ok:
      return 'Success, redirecting to login page...';
    case signupStatusEnums.connection_error:
      return 'Unable to connect to server.';
    case signupStatusEnums.password_mismatch:
      return 'Password comfirmation is not matching.';
    case signupStatusEnums.username_taken:
      return 'Username has already been taken.';
    case signupStatusEnums.server_error:
      return 'Something went wrong server-side.';
    case signupStatusEnums.error:
      return 'Invalid request. What did you do?';
    case signupStatusEnums.unknown:
      return 'Unknown error. no handle';
    default:
      return null;
  }
}

function httpToSignupStatus(code: HttpStatus): signupStatusEnums {
  switch (code) {
    case HttpStatus.OK:
      return signupStatusEnums.ok;
    case HttpStatus.NOT_ACCEPTABLE:
      return signupStatusEnums.username_taken;
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return signupStatusEnums.server_error;
    case HttpStatus.BAD_REQUEST:
      return signupStatusEnums.error;
    default:
      return signupStatusEnums.unknown;
  }
}

export default class SignInController extends Component {
  state = {
    signinStatus: '',
    signupStatus: signupStatusEnums.default,
  };

  doSubmit = async (username, password) => {
    let response;
    try {
      response = await axios.post(backendRoutes.AUTH, {
        username,
        password,
      });
    } catch (error) {
      console.error(error.response.data);
      this.setState({ signinStatus: error.response.data }); // Let SignIn know the account was not successful in logging in
      return;
    }
    console.log(response);
    this.setState({ signinStatus: 'OK' });
    socket.emit(ioEvents.LOGGED_IN, { username });
  };

  sendSignupRequest = async (
    username,
    firstName,
    lastName,
    password,
    accountType
  ) => {
    console.log('sending request');
    let response;
    try {
      response = await axios.post(backendRoutes.SIGNUP, {
        username,
        firstName,
        lastName,
        password,
        accountType,
      });
    } catch (e) {
      this.setState({ signupStatus: httpToSignupStatus(e.response.status) });
      return;
    }
    this.setState({ signupStatus: httpToSignupStatus(response.status) });
  };

  doSignup = (username, firstName, lastName, pass1, pass2, accountType) => {
    if (pass1.localeCompare(pass2) !== 0) {
      this.setState({ signupStatus: signupStatusEnums.password_mismatch });
    } else {
      this.sendSignupRequest(username, firstName, lastName, pass1, accountType);
    }
  };

  render() {
    const { signinStatus, signupStatus } = this.state;
    return (
      <Switch>
        <Route
          exact
          path={routes.HOME}
          render={props =>
            signinStatus === 'OK' ? (
              <Redirect push to={routes.DASHBOARD} />
            ) : (
              <Prompt
                {...props}
                handleSubmit={this.doSubmit}
                status={signinStatus}
              />
            )
          }
        />
        <Route
          path={routes.SIGNUP}
          render={props =>
            signupStatus === signupStatusEnums.ok ? (
              <Redirect push to={routes.HOME} />
            ) : (
              <CreateAccount
                {...props}
                handleSignup={this.doSignup}
                status={signupStatusToString(signupStatus)}
              />
            )
          }
        />
      </Switch>
    );
  }
}
