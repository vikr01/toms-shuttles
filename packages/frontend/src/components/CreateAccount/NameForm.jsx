// @flow
import React, { Fragment } from 'react';
import { FormControl, Input, InputLabel } from '@material-ui/core';
import type { Node } from 'react';

const NameForm = (): Node => (
  <Fragment>
    <FormControl margin="normal" required fullWidth>
      <InputLabel htmlFor="firstName">First Name</InputLabel>
      <Input id="firstName" name="firstName" autoComplete="firstName" />
    </FormControl>
    <FormControl margin="normal" required fullWidth>
      <InputLabel htmlFor="lastName">Last Name</InputLabel>
      <Input id="lastName" name="lastName" autoComplete="lastName" />
    </FormControl>
  </Fragment>
);

export default NameForm;
