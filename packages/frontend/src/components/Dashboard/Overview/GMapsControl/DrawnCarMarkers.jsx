// @flow
import React, { Fragment } from 'react';
import { DrawCarMarker } from './Drawing';

type Driver = {
  username: string,
  currentLatitude: number,
  currentLongitude: number,
};

type Props = {
  allDrivers: ?Array<Driver>,
};

const DrawnCarMarkers = ({ allDrivers }: Props) => {
  if (!allDrivers) return null;

  return (
    <Fragment>
      {allDrivers.map((t: Driver) => (
        <DrawCarMarker
          key={t.username}
          coords={{ lat: t.currentLatitude, lng: t.currentLongitude }}
        />
      ))}
    </Fragment>
  );
};

export default DrawnCarMarkers;
