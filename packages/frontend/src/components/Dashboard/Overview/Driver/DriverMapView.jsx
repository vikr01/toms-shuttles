// @flow
import React, { Component, Fragment } from 'react';
import { Typography, Button } from '@material-ui/core';
import { geolocated } from 'react-geolocated';
import axios from 'axios';
import type { Node } from 'react';
import DriverGMapsControl from './DriverGMapsControl';
import DisplayStatus from '../../../DisplayStatus';

type Props = {
  showMap: boolean,
  isAvailable: boolean,
  onSetAvailable: Function,
  status: string,
  driverInfo: ?('Client' | 'Driver'),
  availabilityFound: boolean,
};

function LiveGMapDriverView({
  showMap,
  isAvailable,
  onSetAvailable,
  status,
  driverInfo,
  availabilityFound,
}: Props): Node {
  if (showMap) {
    console.log(driverInfo);
    return (
      <Fragment>
        {availabilityFound &&
          !isAvailable && (
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
        {availabilityFound &&
          isAvailable && (
            <Fragment>
              <Typography variant="h5">
                {
                  "✅ You're now available. Click below when you're ready to stop"
                }
              </Typography>
              <Button variant="contained" onClick={() => onSetAvailable(false)}>
                Make yourself unavailable
              </Button>
            </Fragment>
          )}
        {!availabilityFound && (
          <Typography variant="h5">Loading your data...</Typography>
        )}
        <DisplayStatus status={status} />
        <div style={{ height: '10px' }} />
        <div style={{ height: '80vh', width: '100%' }}>
          <DriverGMapsControl driverInfo={driverInfo} route={!!driverInfo} />
        </div>
      </Fragment>
    );
  }
  return null;
}

type DriverMapViewProps = {
  showMap: boolean,
  isGeolocationEnabled: boolean,
};

type DriverMapViewState = {
  isAvailable: boolean,
  availabilityFound: boolean,
  status: string,
  coords: {
    latitude?: string,
    longitude?: string,
  },
  driverInfo?: 'Client' | 'Driver',
  fetchInterval?: IntervalID,
};

class DriverMapView extends Component<DriverMapViewProps, DriverMapViewState> {
  props: DriverMapViewProps;

  state: DriverMapViewState = {
    isAvailable: false,
    availabilityFound: false,
    status: '',
    coords: {},
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.coords !== state.coords && nextProps.coords != null) {
      console.log('User location aquired, ', nextProps.coords);
      return { coords: nextProps.coords };
    }
    return null;
  }

  async componentDidMount() {
    let response;
    try {
      response = await axios.get(backendRoutes.USER);
    } catch (error) {
      console.error(error);
      return;
    }
    await this.onSetAvailable(response.data.driverInfo.active === 1);
    this.setState({ availabilityFound: true });
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
        const interval = setInterval(async () => {
          let response;
          try {
            response = await axios.get(backendRoutes.USER);
          } catch (error) {
            console.error(error);
            throw error;
          }
          this.setState({ driverInfo: response.data.driverInfo });
        }, 100);
        this.setState({ fetchInterval: interval });
      } else {
        // retrieve interval object from state and stop it
        const { fetchInterval } = this.state;
        clearInterval(fetchInterval);
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
    const { isAvailable, status, driverInfo, availabilityFound } = this.state;
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
          onSetAvailable={e => this.onSetAvailable(e)}
          isAvailable={isAvailable}
          status={status}
          driverInfo={driverInfo}
          availabilityFound={availabilityFound}
        />
      </Fragment>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 25000,
})(DriverMapView);
