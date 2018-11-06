// @flow
import React from 'react';
import { FormControl, Input, InputLabel } from '@material-ui/core';
import type { Node } from 'react';

const UsernameForm = (): Node => (
  <FormControl margin="normal" required fullWidth>
    <InputLabel htmlFor="username">Username</InputLabel>
    <Input id="username" name="username" autoComplete="username" />
  </FormControl>
);

export default UsernameForm;
