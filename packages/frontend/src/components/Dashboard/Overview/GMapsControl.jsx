/* global google */
// @flow
import React, { Fragment } from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  Polyline,
  TrafficLayer,
  Marker,
} from 'react-google-maps';
import axios from 'axios';
import AlertDialog from './AlertDialog';
import { estimateCost } from './CostEstimater';

const GMapsControl = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDdFTrNJ3AHz6_978tDmRvRYXbdBHVRLWI&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidUpdate() {
      if (this.state.atDestination) {
        clearInterval(this.state.toLocationInterval);
      }
      if (this.state.atUser && this.state.userInCar) {
        clearInterval(this.state.toUserInterval);
        const timeToDest = (this.state.timeToDestination / 60) * 1000;
        const timePerInterval = 50;
        const ticksPerInterval =
          this.state.directions.length / (timeToDest / timePerInterval);
        let c = 0;
        const interval = setInterval(() => {
          if (c < this.state.directions.length - 1) {
            const pos1 = this.state.directions[parseInt(c, 10)];
            const pos2 = this.state.directions[parseInt(c + 1, 10)];
            const pos = { lat: pos1.lat(), lng: pos1.lng() };
            const rot =
              (180 / 3.141) *
              Math.atan2(pos2.lng() - pos1.lng(), pos2.lat() - pos1.lat());
            this.setState({ driverLocation: pos, driverRotation: rot });
            c += ticksPerInterval;
          } else {
            c = this.state.directions.length - 1;
            this.setState({
              atDestination: true,
              atDestinationDialogShow: true,
            });
          }
        }, timePerInterval);
        this.state.setLocationInterval(interval);
      }

      if (this.props.assignedDriver) {
        if (this.props.driverArriving && !this.state.hasDriverDirections) {
          const { data, assignedDriver } = this.props;
          console.log('we should get directions to driver');
          console.log('making route request!', data);
          const DirectionsService = new google.maps.DirectionsService();
          DirectionsService.route(
            {
              origin: new google.maps.LatLng(
                assignedDriver.currentLatitude,
                assignedDriver.currentLongitude
              ),
              destination: new google.maps.LatLng(data.from.lat, data.from.lng),
              travelMode: google.maps.TravelMode.DRIVING,
            },
            async (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                  directionsToUser: result.routes[0].overview_path,
                  hasDriverDirections: true,
                  driverLocation: {
                    lat: assignedDriver.currentLatitude,
                    lng: assignedDriver.currentLongitude,
                  },
                  userLocation: data.from,
                  boundsDriver: result.routes[0].bounds,
                });
                const { duration } = result.routes[0].legs[0];

                const timeToDest = (duration.value / 60) * 1000;
                const timePerInterval = 50;
                const ticksPerInterval =
                  this.state.directionsToUser.length /
                  (timeToDest / timePerInterval);
                let c = 0;
                const interval = setInterval(() => {
                  if (c < this.state.directionsToUser.length - 1) {
                    const pos1 = this.state.directionsToUser[parseInt(c, 10)];
                    const pos2 = this.state.directionsToUser[
                      parseInt(c + 1, 10)
                    ];
                    const pos = { lat: pos1.lat(), lng: pos1.lng() };
                    const rot =
                      (180 / 3.141) *
                      Math.atan2(
                        pos2.lng() - pos1.lng(),
                        pos2.lat() - pos1.lat()
                      );
                    this.setState(() => ({
                      driverLocation: pos,
                      driverRotation: rot,
                    }));
                    c += ticksPerInterval;
                  } else {
                    c = this.state.directionsToUser.length - 1;
                    this.setState({ atUserDialogShow: true });
                  }
                }, timePerInterval);

                this.setState({ toUserInterval: interval });
              } else {
                console.error(`error fetching directions ${result}`);
                console.error(`status code: ${status}`);
              }
            }
          );
        }
      }
    },
    async componentWillMount() {
      await this.setState({
        atUser: false,
        atDestination: false,
        onArrivalToDestinationDialogClosed: async routeCost => {
          console.log('payment stuff happens here, ', routeCost);

          try {
            await axios.post(backendRoutes.ARRIVAL, {
              cost: routeCost,
              location: this.props.to,
            });
            console.log('success');
            // TODO: reset frontend to prepare for other trip. Leave ratings?
          } catch (e) {
            // something went wrong.
            console.error(e);
          }
          window.location.reload();
        },
        onDriverArrivedDialogClosed: () => {
          this.setState({
            atUser: true,
            userInCar: true,
            atUserDialogShow: false,
          });
        },
        setLocationInterval: interval => {
          this.setState({ toLocationInterval: interval, atUser: false });
        },
        onDirectionChange: () => {
          const { data, routeSet } = this.props;
          console.log('making route request!', data);
          const DirectionsService = new google.maps.DirectionsService();
          DirectionsService.route(
            {
              origin: new google.maps.LatLng(data.from.lat, data.from.lng),
              destination: new google.maps.LatLng(data.to.lat, data.to.lng),
              travelMode: google.maps.TravelMode.DRIVING,
            },
            async (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                const { distance, duration } = result.routes[0].legs[0];
                await routeSet(duration, distance);
                const cost = estimateCost(distance.value).toFixed(2);
                this.setState({
                  directions: result.routes[0].overview_path,
                  from: data.from,
                  to: data.to,
                  routeCost: cost,
                  timeToDestination: duration.value,
                  bounds: result.routes[0].bounds,
                });
                console.log('directions: ', result.routes[0]);
              } else {
                console.error(`error fetching directions ${result}`);
                console.error(`status code: ${status}`);
              }
            }
          );
        },
      });
    },
  })
)(props => (
  <Fragment>
    <AlertDialog
      open={props.atUserDialogShow}
      title="Driver arrived"
      text="Your driver has arrived"
      onClose={props.onDriverArrivedDialogClosed}
    />
    <AlertDialog
      open={props.atDestinationDialogShow}
      title="Arrived"
      text={`You have arrived at your destination! Your credit card was charged $${
        props.routeCost
      }`}
      onClose={() => {
        props.onArrivalToDestinationDialogClosed(props.routeCost);
      }}
    />
    <GoogleMap
      ref={map =>
        map &&
        props.boundsDriver &&
        map.fitBounds(props.userInCar ? props.bounds : props.boundsDriver)
      }
      defaultZoom={11}
      defaultCenter={new google.maps.LatLng(37.3352, -121.8811)}
    >
      <TrafficLayer autoUpdate />
      {props.coords &&
        !props.directions && (
          <Marker
            position={
              new window.google.maps.LatLng(
                props.coords.latitude,
                props.coords.longitude
              )
            }
            icon={{
              path:
                'M 10, 10 m -7.5, 0 a 7.5,7.5 0 1,0 15,0 a 7.5,7.5 0 1,0 -15,0',
              anchor: { x: 5, y: 5 },
              strokeColor: 'blue',
              strokeWeight: 1,
              fillColor: 'darkblue',
              fillOpacity: 1,
            }}
            labelContent="myLocation"
          />
        )}
      {props.route && props.onDirectionChange()}
      {props.directions && (
        <Fragment>
          <Polyline
            path={props.directions}
            geodesic
            options={{
              strokeColor: '#0e0eff',
              strokeOpacity: 0.8,
              strokeWeight: 5,
              clickable: false,
            }}
          />
          {props.from &&
            props.to && (
              <Fragment>
                <Marker
                  position={
                    new window.google.maps.LatLng(
                      props.from.lat,
                      props.from.lng
                    )
                  }
                  labelContent="from"
                />
                <Marker
                  position={
                    new window.google.maps.LatLng(props.to.lat, props.to.lng)
                  }
                  labelContent="to"
                />
              </Fragment>
            )}
          {props.driverLocation &&
            props.userLocation && (
              <Marker
                position={
                  new window.google.maps.LatLng(
                    props.driverLocation.lat,
                    props.driverLocation.lng
                  )
                }
                optimized={false}
                icon={{
                  path:
                    'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805zz',
                  fillColor: 'red',
                  anchor: { x: 25, y: 26 },
                  rotation: props.driverRotation,
                  strokeColor: 'black',
                  strokeWeight: 1,
                  scale: 0.6,
                  fillOpacity: 1,
                }}
              />
            )}
        </Fragment>
      )}
    </GoogleMap>
  </Fragment>
));

export default GMapsControl;
