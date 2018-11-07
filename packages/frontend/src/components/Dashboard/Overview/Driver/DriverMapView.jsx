// @flow
import React, { Fragment } from 'react';

import { Typography, Button } from '@material-ui/core';

import { geolocated, geoPropTypes } from 'react-geolocated';
import axios from 'axios';
import GMapsControl from '../GMapsControl';
import DisplayStatus from '../../../DisplayStatus';

function LiveGMapDriverView({
  showMap,
  data,
  route,
  routeSet,
  duration,
  distance,
  requestRide,
  assignedDriver,
  driverArriving,
  coords,
  isAvailable,
  onSetAvailable,
  status,
}: props) {
  if (showMap) {
    return (
      <Fragment>
        {!isAvailable && (
          <Fragment>
            <Typography variant="h5">
              {
                "🔴 You're currently not set to available. Click below when you're ready to pick up clients"
              }
            </Typography>
            <Button variant="contained" onClick={() => onSetAvailable(true)}>
              Make yourself available
            </Button>
          </Fragment>
        )}
        {isAvailable && (
          <Fragment>
            <Typography variant="h5">
              {"✅ You're now available. Click below when you're ready to stop"}
            </Typography>
            <Button variant="contained" onClick={() => onSetAvailable(false)}>
              Make yourself unavailable
            </Button>
          </Fragment>
        )}
        <DisplayStatus status={status} />
        <div style={{ height: '10px' }} />
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
      driverArriving: false,
      disableRequestButtons: false,
    },
    duration: null,
    distance: null,
    isAvailable: false,
    status: '',
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.coords !== state.coords && nextProps.coords != null) {
      console.log('User location aquired, ', nextProps.coords);
      return { coords: nextProps.coords };
    }
    return null;
  }

  async onSetAvailable(val) {
    // send info to backend
    const { coords } = this.state;
    const { isGeolocationEnabled } = this.props;

    if (!isGeolocationEnabled) {
      this.setState({ status: 'Enable location services to start working!' });
      return;
    }
    try {
      await axios.put(backendRoutes.DRIVERS, {
        active: val,
        currentLatitude: coords.latitude,
        currentLongitude: coords.longitude,
      });
      if (val) {
        // start polling backend for assigned users
        // save interval object in state to be stopped later
      } else {
        // retrieve interval object from state and stop it
      }
      this.setState({ isAvailable: val, status: '' });
    } catch (e) {
      console.error(e);
      this.setState({
        status: 'Issue connecting to server',
      });
    }
  }

  render() {
    const { showMap, isGeolocationEnabled } = this.props;
    const {
      data,
      route,
      duration,
      distance,
      driverArriving,
      assignedDriver,
      coords,
      isAvailable,
      status,
    } = this.state;
    return (
      <Fragment>
        {!isGeolocationEnabled && (
          <Typography variant="title" color="seconary">
            {
              '❗️You need to enable location services to use the service as a driver\n❗️'
            }
          </Typography>
        )}
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
          onSetAvailable={e => this.onSetAvailable(e)}
          isAvailable={isAvailable}
          status={status}
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
