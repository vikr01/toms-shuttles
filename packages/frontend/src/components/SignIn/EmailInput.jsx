// @flow
import React from 'react';
import { InputLabel, Input, FormControl } from '@material-ui/core';
import type { Node } from 'react';

const SignInEmailInput = (): Node => (
  <FormControl margin="normal" required fullWidth>
    <InputLabel htmlFor="email">Email Address</InputLabel>
    <Input id="email" name="email" autoComplete="email" autoFocus />
  </FormControl>
);

export default SignInEmailInput;
