// @flow
import React, { Component, Fragment } from 'react';
import {
  Button,
  CssBaseline,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Select,
  MenuItem,
} from '@material-ui/core';
import type { Node } from 'react';
import UsernameForm from './UsernameForm';
import PasswordForm from './PasswordForm';
import DisplayStatus from '../DisplayStatus';
import NameForm from './NameForm';

type Props = {
  handleSignup: Function,
  status: string,
};

type State = {
  accountType: string,
  hideAccountTypeLabel: ?boolean,
};

export default class CreateAccount extends Component<Props, State> {
  props: Props;

  state = {
    accountType: '', // cannot be null as value of a Select cannot be null
  };

  onSubmit = event => {
    event.preventDefault();
    const { handleSignup } = this.props;
    const { accountType } = this.state;
    const { elements: elem } = event.target;
    const { value: username } = elem.username;
    const { value: firstName } = elem.firstName;
    const { value: lastName } = elem.lastName;
    const { value: pass1 } = elem.password;
    const { value: pass2 } = elem.password2;

    if (
      [username, firstName, lastName, pass1, pass2].includes(undefined) ||
      accountType === ''
    ) {
      return;
    }

    handleSignup(username, firstName, lastName, pass1, pass2, accountType);
  };

  render(): Node {
    const { status } = this.props;
    const { accountType, hideAccountTypeLabel } = this.state;
    return (
      <Fragment>
        <CssBaseline />
        <Paper className="paper">
          <Typography variant="headline" className="textCenter">
            Sign up
          </Typography>
          <form className="form" onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel
                htmlFor="account_type"
                disabled={hideAccountTypeLabel}
              >
                Account Type
              </InputLabel>
              <Select
                id="account_type"
                name="account_type"
                autoFocus
                value={accountType}
                onChange={({ target: { value } }) => {
                  this.setState({
                    accountType: value,
                    hideAccountTypeLabel: value !== '',
                  });
                }}
              >
                <MenuItem value="">
                  <em>Select one</em>
                </MenuItem>
                <MenuItem value="Driver">Driver</MenuItem>
                <MenuItem value="Client">Client</MenuItem>
              </Select>
            </FormControl>
            <UsernameForm />
            <NameForm />
            <PasswordForm name="password" value="Password" />
            <PasswordForm name="password2" value="Confirm Password" />
            <Button
              type="submit"
              fullWidth
              variant="raised"
              color="primary"
              className="submit"
            >
              Sign Up
            </Button>
            <DisplayStatus status={status} />
          </form>
        </Paper>
      </Fragment>
    );
  }
}
