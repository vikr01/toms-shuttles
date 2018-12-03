// @flow
import React, { Fragment } from 'react';
import { Typography, Button } from '@material-ui/core';
import { geolocated, geoPropTypes } from 'react-geolocated';
import axios from 'axios';
import backendRoutes from 'toms-shuttles-backend/routes';
import RequestForm from './RequestForm';
import GMapsControl from './GMapsControl';
import CostEstimater from './CostEstimater';
import AlertDialog from './AlertDialog';

function LiveGMapView({
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
        <div className="row">
          <div className="col">
            <RequestForm
              sendRequestToAirport={doRequestToAirport}
              sendRequestFromAirport={doRequestFromAirport}
              haveUserPosition={coords !== undefined}
              disableRequestButtons={disableRequestButtons}
            />
          </div>
          <div className="col">
            {duration && distance ? (
              <Fragment>
                <Typography variant="h4">
                  {`Estimated duration: ${duration.text}`}
                </Typography>
                <CostEstimater meters={distance.value} />
                <Button
                  variant="contained"
                  onClick={requestRide}
                  disabled={disableRequestButtons}
                >
                  Make request
                </Button>
                <div style={{ height: '50px' }} />

                {!assignedDriver ? null : (
                  <Typography variant="h4">
                    {`You have been assigned to driver ${
                      assignedDriver.username
                    }`}
                  </Typography>
                )}
                <br />
              </Fragment>
            ) : null}
          </div>
        </div>
        <div style={{ height: '80vh', width: '100%' }}>
          <GMapsControl
            data={data}
            route={route}
            routeSet={routeSet}
            assignedDriver={assignedDriver}
            driverArriving={driverArriving}
            coords={coords}
            distance={distance}
          />
        </div>
      </Fragment>
    );
  }
  return null;
}

type RequestButtonProps = {
  showMap: boolean,
  startRequest: func,
};

function RequestButton({ showMap, startRequest }: RequestButtonProps) {
  if (showMap) {
    return null;
  }
  return (
    <Button variant="contained" onClick={startRequest}>
      Request Ride
    </Button>
  );
}

function airportToCoords(airport) {
  if (airport === 'SFO') {
    return { lat: 37.6213, lng: -122.381 };
  }
  if (airport === 'OAK') {
    return { lat: 37.7126, lng: -122.222 };
  }
  if (airport === 'SJC') {
    return { lat: 37.364, lng: -121.931 };
  }
  return null;
}

type Props = {
  showMap: boolean,
  startRequest: func,
};

class MapView extends React.Component<Props> {
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
    status: '',
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.coords !== state.coords && nextProps.coords != null) {
      console.log('User location aquired, ', nextProps.coords);
      return { coords: nextProps.coords };
    }
    return null;
  }

  doRequestToAirport = (airport, lat = null, lng = null) => {
    const { coords, isGeolocationEnabled } = this.props;
    console.log('we are doing stuf', airport);
    console.log(coords);
    console.log('isGeolocationEnabled', isGeolocationEnabled);

    const fromCoords =
      lat === null
        ? { lat: coords.latitude, lng: coords.longitude }
        : { lat, lng };
    const toCoords = airportToCoords(airport);
    this.setState({ data: { to: toCoords, from: fromCoords }, route: true });
  };

  doRequestFromAirport = (airport, lat, lng) => {
    const fromCoords = airportToCoords(airport);
    const toCoords = { lat, lng };
    this.setState({ data: { to: toCoords, from: fromCoords }, route: true });
    console.log('from ', airport, ' to ', lat, lng);
  };

  routeSet = (duration, distance) => {
    this.setState({ route: false, duration, distance });
  };

  requestRide = async () => {
    const { data } = this.state;
    console.log('requesting ride now');
    console.log(data);
    let response;
    try {
      response = await axios.get(
        `${backendRoutes.CLOSEST_DRIVER}?lat=${data.from.lat}&lng=${
          data.from.lng
        }&destLat=${data.to.lat}&destLng=${data.to.lng}&groupSize=1`
      );

      console.log(response);
      this.setState({
        assignedDriver: response.data,
        driverArriving: true,
        disableRequestButtons: true,
      });
    } catch (error) {
      console.log(error.response.data);
      this.setState({ status: error.response.data });
      console.error(error);
      // handle error
    }
  };

  onAlertClose = () => {
    this.setState({ status: '' });
  };

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
      status,
    } = this.state;
    return (
      <Fragment>
        <AlertDialog
          text={status}
          title="Issue"
          onClose={this.onAlertClose}
          open={status !== ''}
        />
        <RequestButton showMap={showMap} startRequest={startRequest} />
        <LiveGMapView
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

MapView.propTypes = { ...MapView.propTypes, ...geoPropTypes };

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 25000,
})(MapView);
