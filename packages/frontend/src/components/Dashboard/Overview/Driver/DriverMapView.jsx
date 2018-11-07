// @flow
import React, { Fragment } from 'react';

import { Typography, Button } from '@material-ui/core';

import { geolocated, geoPropTypes } from 'react-geolocated';
import axios from 'axios';
import GMapsControl from '../GMapsControl';

function LiveGMapDriverView({
  showMap,
  doRequestToAirport,
  doRequestFromAirport,
  data,
  route,
  routeSet,
  duration,
  distance,
  requestRide,
  assignedDriver,
  driverArriving,
  coords,
  disableRequestButtons,
}: props) {
  if (showMap) {
    return (
      <Fragment>
        <div style={{ height: '80vh', width: '100%' }}>
          <GMapsControl
            data={data}
            route={route}
            routeSet={routeSet}
            assignedDriver={assignedDriver}
            driverArriving={driverArriving}
            coords={coords}
          />
        </div>
      </Fragment>
    );
  }
  return null;
}

type Props = {
  showMap: boolean,
  startRequest: func,
};
class DriverMapView extends React.Component<Props> {
  state = {
    data: {
      to: { lat: Number, long: Number },
      from: { lat: Number, long: Number },
      route: false,
      assignedDriver: null,
      driverArriving: false,
      disableRequestButtons: false,
    },
    duration: null,
    distance: null,
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.coords !== state.coords && nextProps.coords != null) {
      console.log('User location aquired, ', nextProps.coords);
      return { coords: nextProps.coords };
    }
    return null;
  }

  render() {
    const { showMap, startRequest } = this.props;
    const {
      data,
      route,
      duration,
      distance,
      driverArriving,
      assignedDriver,
      coords,
      disableRequestButtons,
    } = this.state;
    return (
      <Fragment>
        <LiveGMapDriverView
          showMap={showMap}
          doRequestToAirport={this.doRequestToAirport}
          doRequestFromAirport={this.doRequestFromAirport}
          data={data}
          route={route}
          routeSet={(_duration, _distance) =>
            this.routeSet(_duration, _distance)
          }
          duration={duration}
          distance={distance}
          requestRide={() => this.requestRide()}
          driverArriving={driverArriving}
          assignedDriver={assignedDriver}
          coords={coords}
          disableRequestButtons={disableRequestButtons}
        />
      </Fragment>
    );
  }
}

DriverMapView.propTypes = { ...DriverMapView.propTypes, ...geoPropTypes };

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 25000,
})(DriverMapView);
