// @flow
import React from 'react';
import { FormControl, Input, InputLabel } from '@material-ui/core';
import type { Node } from 'react';

type Props = {
  name: string,
  value: string,
};

const ValueForm = ({ name, value }: Props): Node => (
  <FormControl margin="normal" required fullWidth>
    <InputLabel htmlFor={name}>{value}</InputLabel>
    <Input name={name} type="normal" id={name} />
  </FormControl>
);

export default ValueForm;
