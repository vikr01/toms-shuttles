// @flow
import React from 'react';
import { FormControl, Input, InputLabel } from '@material-ui/core';
import type { Node } from 'react';

type Props = {
  name: string,
  value: string,
};

const PasswordForm = ({ name, value }: Props): Node => (
  <FormControl margin="normal" required fullWidth>
    <InputLabel htmlFor={name}>{value}</InputLabel>
    <Input
      name={name}
      type="password"
      id={name}
      autoComplete="current-password"
    />
  </FormControl>
);

export default PasswordForm;
