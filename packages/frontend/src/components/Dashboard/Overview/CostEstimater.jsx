// @flow
import React from 'react';
import { Typography } from '@material-ui/core';

const COST_PER_MILE = 2;
const METERS_TO_MILES = 1609.344;
const START_COST = 15;
const FIRST_N_MILES_FREE = 2;

type Props = {
  meters: Number,
};

const CostEstimater = ({ meters }: Props) => (
  <Typography variant="h5">
    Cost:
    {' $'}
    {(
      START_COST +
      (COST_PER_MILE *
        (meters - FIRST_N_MILES_FREE < 0 ? 0 : meters - FIRST_N_MILES_FREE)) /
        METERS_TO_MILES
    ).toFixed(2)}
    {` ($${START_COST} basecost + $${COST_PER_MILE} per mile after the first ${FIRST_N_MILES_FREE} miles)`}
  </Typography>
);

export default CostEstimater;
