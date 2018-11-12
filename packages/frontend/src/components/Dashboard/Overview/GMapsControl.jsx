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
import CostEstimater, { estimateCost } from './CostEstimater';

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
    async componentDidUpdate() {
      if (this.state.atUser) {
        // pass
      }
      if (this.state.route) {
        this.state.onDirectionChange();
      }
      if (this.state.atDestination) {
        clearInterval(this.state.toLocationInterval);
        clearInterval(this.state.toLocationCheckInterval);
      }
      // console.log('route: ', this.props.route);
      if (this.props.route && !this.state.hasDriverDirections) {
        console.log('we should get directions to driver');
        // console.log('making route request!', data);

        const { data } = this.props;
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route(
          {
            origin: new google.maps.LatLng(data.from.lat, data.from.lng),
            destination: new google.maps.LatLng(data.to.lat, data.to.lng),
            travelMode: google.maps.TravelMode.DRIVING,
          },
          async (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              this.setState({
                directions: result.routes[0].overview_path,
                hasDriverDirections: true,
                userLocation: data.from,
                route: true,
                boundsDriver: result.routes[0].bounds,
              });
              console.log(result);
              this.props.routeSet(
                result.routes[0].legs[0].duration,
                result.routes[0].legs[0].distance
              );
            } else {
              console.error(status);
            }
          }
        );
      }
    },
    getDirectionPos(c) {
      return this.state.directions[parseInt(c, 10)];
    },
    doCleartoUserInterval() {
      clearInterval(this.state.toUserInterval);
    },
    async componentWillMount() {
      await this.setState(() => ({
        atUser: false,
        atDestination: false,
        hasDriverDirections: false,
        onArrivalToDestinationDialogClosed: async routeCost => {
          console.log('payment stuff happens here, ', routeCost);

          try {
            await axios.post(backendRoutes.ARRIVED, {
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
        onDriverArrivedDialogClosed: async () => {
          this.setState({
            atUser: true,
            userInCar: true,
            atUserDialogShow: false,
          });
          const { destNumToRemove } = this.state;
          const { data, assignedDriver } = this.props;
          // update driver location on backend
          try {
            console.log('removing dest: ', destNumToRemove);
            if (destNumToRemove === 3)
              await axios.put(backendRoutes.DRIVERS, {
                username: assignedDriver.username,
                currentLatitude: data.from.lat,
                currentLongitude: data.from.lng,
                destLat3: 0,
                destLng3: 0,
              });
            else
              await axios.put(backendRoutes.DRIVERS, {
                username: assignedDriver.username,
                currentLatitude: data.from.lat,
                currentLongitude: data.from.lng,
                destLat2: 0,
                destLng2: 0,
              });
            console.log('we set the drivers new data');
            const set = () => {
              this.setState({
                atUser: false,
              });
            };
            set();
          } catch (e) {
            console.error(e);
          }
          this.doCleartoUserInterval();
        },
        setLocationInterval: interval => {
          this.setState({
            toLocationInterval: interval,
            atUser: false,
          });
        },
        onDirectionChange: () => {
          const { data } = this.props;
          console.log('making route request!', data);
          this.setState({ route: false });
          let currentDestination = 0;
          const checkInterval = setInterval(async () => {
            let response;
            const { assignedDriver } = this.props;
            const { driverLocation } = this.state;
            if (assignedDriver)
              try {
                // update driver location
                // driverLocation
                if (driverLocation)
                  try {
                    await axios.put(backendRoutes.DRIVERS, {
                      username: assignedDriver.username,
                      currentLatitude: driverLocation.lat,
                      currentLongitude: driverLocation.lng,
                    });
                    console.log('we set the drivers new data');
                    // this.setState({
                    //  atUser: false,
                    // });
                  } catch (e) {
                    console.error(e);
                    this.setState({ status: 'Issue connecting to server' });
                  }

                // check if username exists
                response = await axios.get(
                  backendRoutes.DRIVER.replace(
                    ':username',
                    assignedDriver.username
                  )
                );
                console.log('assignedDriver: ', assignedDriver);
                if (assignedDriver) {
                  const lastNum = currentDestination;
                  console.log('lets find a path');
                  if (response.data.destLat3 !== 0) {
                    // use dest3

                    if (currentDestination !== 3) {
                      this.state.makePathRequestAndAnimate(
                        response.data,
                        3,
                        response.data.destLat3,
                        response.data.destLng3
                      );
                    }
                    currentDestination = 3;
                  } else if (response.data.destLat2 !== 0) {
                    console.log('path 2 is good');
                    if (currentDestination !== 2) {
                      this.state.makePathRequestAndAnimate(
                        response.data,
                        2,
                        response.data.destLat2,
                        response.data.destLng2
                      );
                    }
                    currentDestination = 2;
                    // use dest2
                  } else if (response.data.destLat1 !== 0) {
                    if (currentDestination !== 1) {
                      this.state.makePathRequestAndAnimate(
                        response.data,
                        1,
                        response.data.destLat1,
                        response.data.destLng1
                      );
                    }
                    currentDestination = 1;
                    // use dest1
                  }
                  if (currentDestination > lastNum && lastNum !== 0) {
                    // we should get a discount
                    this.setState({ discount: 10 });
                  }
                }
                console.log(currentDestination);
                console.log(response);
              } catch (error) {
                console.error(error);
              }
          }, 1000);

          this.setState({ toLocationCheckInterval: checkInterval });
        },

        makePathRequestAndAnimate: (
          assignedDriver,
          destNum,
          lat: number,
          lng: number
        ) => {
          const { userLocation } = this.state;
          console.log('makePathRequestAndAnimate ', destNum);
          this.doCleartoUserInterval();
          const DirectionsService = new google.maps.DirectionsService();
          DirectionsService.route(
            {
              origin: new google.maps.LatLng(
                assignedDriver.currentLatitude,
                assignedDriver.currentLongitude
              ),
              destination: new google.maps.LatLng(lat, lng),
              travelMode: google.maps.TravelMode.DRIVING,
            },
            async (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                  directions: result.routes[0].overview_path,
                  hasDriverDirections: true,
                  driverLocation: {
                    lat: assignedDriver.currentLatitude,
                    lng: assignedDriver.currentLongitude,
                  },
                  // userLocation: data.from,
                  boundsDriver: result.routes[0].bounds,
                });
                const { duration } = result.routes[0].legs[0];

                const timeToDest = (duration.value / 60) * 1000;
                const timePerInterval = 50;
                const ticksPerInterval =
                  this.state.directions.length / (timeToDest / timePerInterval);
                let c = 0;

                const interval = setInterval(() => {
                  if (c < this.state.directions.length - 1) {
                    const pos1 = this.getDirectionPos(c);
                    const pos2 = this.getDirectionPos(c + 1);
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
                    c = this.state.directions.length - 1;
                    console.log('lat ', parseFloat(lat, 10));
                    console.log('userlat: ', userLocation.lat);
                    if (
                      Math.abs(parseFloat(lat, 10) - userLocation.lat) < 0.001
                    ) {
                      console.log('showing at user dialog');
                      this.setState({
                        destNumToRemove: destNum,
                        atUserDialogShow: true,
                      });
                    }
                    if (destNum === 1) {
                      // final destination
                      this.setState({ atDestinationDialogShow: true });
                    }
                  }
                }, timePerInterval);

                this.setState({ toUserInterval: interval });
              } else {
                console.error(`error fetching directions ${result}`);
                console.error(`status code: ${status}`);
              }
            }
          );
        },
      }));
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
    {props.distance && (
      <AlertDialog
        open={props.atDestinationDialogShow}
        title="Arrived"
        text={`You have arrived at your destination! Your credit card was charged $${estimateCost(
          props.distance.value
        ).toFixed(2) - (props.discount ? props.discount : 0)}${
          props.discount
            ? 'You received a discount because we picked up a second passenger'
            : ''
        }`}
        onClose={() => {
          props.onArrivalToDestinationDialogClosed(
            estimateCost(props.distance.value.toFixed(2))
          );
        }}
      />
    )}
    <GoogleMap
      ref={map =>
        map && props.boundsDriver && map.fitBounds(props.boundsDriver)
      }
      defaultZoom={11}
      defaultCenter={new google.maps.LatLng(37.3352, -121.8811)}
    >
      <TrafficLayer autoUpdate />
      <DrawUserPosition coords={props.coords} directions={props.directions} />
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

          <DrawMarker coords={props.data.from} />
          <DrawMarker coords={props.data.to} />
          {props.driverLocation && (
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
type DrawMarkerProps = {
  coords: object,
};
const DrawMarker = ({ coords }: DrawMarkerProps) => {
  if (!coords) return null;
  return (
    <Marker position={new window.google.maps.LatLng(coords.lat, coords.lng)} />
  );
};

const DrawUserPosition = ({ coords }: DrawMarkerProps) => {
  if (!coords) return null;
  return (
    <Marker
      position={
        new window.google.maps.LatLng(coords.latitude, coords.longitude)
      }
      icon={{
        path: 'M 10, 10 m -7.5, 0 a 7.5,7.5 0 1,0 15,0 a 7.5,7.5 0 1,0 -15,0',
        anchor: { x: 5, y: 5 },
        strokeColor: 'blue',
        strokeWeight: 1,
        fillColor: 'darkblue',
        fillOpacity: 1,
      }}
      labelContent="myLocation"
    />
  );
};

export default GMapsControl;
