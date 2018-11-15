// @flow
import React from 'react';
import { Typography } from '@material-ui/core';

const COST_PER_MILE = 1;
const METERS_TO_MILES = 1609.344;
const START_COST = 15;
const FIRST_N_MILES_FREE = 2;

export function estimateCost(meters: number): number {
  return (
    START_COST +
    (COST_PER_MILE *
      (meters - FIRST_N_MILES_FREE < 0 ? 0 : meters - FIRST_N_MILES_FREE)) /
      METERS_TO_MILES
  );
}

type Props = {
  meters: number,
};

const CostEstimater = ({ meters }: Props) => (
  <Typography variant="h5">
    Cost:
    {' $'}
    {estimateCost(meters).toFixed(2)}
    {` ($${START_COST} basecost + $${COST_PER_MILE} per mile after the first ${FIRST_N_MILES_FREE} miles)`}
  </Typography>
);

export default CostEstimater;
