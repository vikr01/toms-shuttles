// @flow
import React from 'react';
import { InputLabel, Input, FormControl } from '@material-ui/core';
import type { Node } from 'react';

const SignInPasswordInput = (): Node => (
  <FormControl margin="normal" required fullWidth>
    <InputLabel htmlFor="password">Password</InputLabel>
    <Input
      name="password"
      type="password"
      id="password"
      autoComplete="current-password"
    />
  </FormControl>
);

export default SignInPasswordInput;
