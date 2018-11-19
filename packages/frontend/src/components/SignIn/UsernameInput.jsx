// @flow
import React from 'react';
import { InputLabel, Input, FormControl } from '@material-ui/core';
import type { Node } from 'react';

const SignInUsernameInput = (): Node => (
  <FormControl margin="normal" required fullWidth>
    <InputLabel htmlFor="username">Username</InputLabel>
    <Input id="username" name="username" autoComplete="username" autoFocus />
  </FormControl>
);

export default SignInUsernameInput;
