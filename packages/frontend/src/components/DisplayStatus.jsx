// @flow
import React from 'react';
import { Typography } from '@material-ui/core';
import type { Node } from 'react';

type Props = {
  status: ?string,
};

const DisplayStatus = ({ status }: Props): Node => {
  if (!status) {
    return null;
  }
  return (
    <Typography
      className="displayErrorSignup"
      variant="subheading"
      align="center"
      color="error"
    >
      {status}
    </Typography>
  );
};

export default DisplayStatus;
