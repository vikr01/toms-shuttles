// @flow
import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { withGoogleMap, withScriptjs } from 'react-google-maps';
import axios from 'axios';
import backendRoutes from 'toms-shuttles-backend/routes';
import MainComponent from './MainComponent';

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
      if (this.props.assignedDriver && this.state.allDrivers) {
        clearInterval(this.state.allActiveDriversInterval);
        this.clearAllDrivers();
      }
      if (this.state.route) {
        this.state.onDirectionChange();
      }
      if (this.state.atDestination) {
        clearInterval(this.state.toLocationInterval);
        clearInterval(this.state.toLocationCheckInterval);
      }
      // console.log('route: ', this.props.route);
      if (
        this.props.route &&
        (!this.state.hasDriverDirections || this.newPath())
      ) {
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
                currentToLat: data.to.lat,
                currentToLng: data.to.ng,
                currentFromLat: data.from.lat,
                currentFromLng: data.from.lng,
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
    newPath() {
      return (
        this.state.currentToLat !== this.props.data.to.lat ||
        this.state.currentToLng !== this.props.data.to.lng ||
        this.state.currentFromLat !== this.props.data.from.lat ||
        this.state.currentFromLng !== this.props.data.from.lng
      );
    },
    getDirectionPos(c) {
      return this.state.directions[parseInt(c, 10)];
    },
    doCleartoUserInterval() {
      clearInterval(this.state.toUserInterval);
    },
    clearLocationInterval() {
      clearInterval(this.state.toLocationCheckInterval);
    },
    clearAllDrivers() {
      this.setState({ allDrivers: null });
    },
    async componentWillMount() {
      // fetch all drivers
      console.log('fetch all driver interval start');
      const allDriversInterval = setInterval(async () => {
        try {
          const res = await axios.get(backendRoutes.ALL_ACTIVE_DRIVERS);
          this.setState({ allDrivers: res.data });
        } catch (err) {
          console.error(err);
        }
      }, 1000);
      this.setState({
        startedAllDriverInterval: true,
        allActiveDriversInterval: allDriversInterval,
      });

      await this.setState(() => ({
        atUser: false,
        atDestination: false,
        hasDriverDirections: false,
        startedAllDriverInterval: false,
        allActiveDriversInterval: null,
        currentToLat: 0,
        currentToLng: 0,
        currentFromLat: 0,
        currentFromLng: 0,
        onArrivalToDestinationDialogClosed: async routeCost => {
          console.log('payment stuff happens here, ', routeCost);
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
            let res;
            if (destNumToRemove === 3)
              res = await axios.put(backendRoutes.DRIVERS, {
                username: assignedDriver.username,
                currentLatitude: data.from.lat,
                currentLongitude: data.from.lng,
                destLat3: 0,
                destLng3: 0,
              });
            else
              res = await axios.put(backendRoutes.DRIVERS, {
                username: assignedDriver.username,
                currentLatitude: data.from.lat,
                currentLongitude: data.from.lng,
                destLat2: 0,
                destLng2: 0,
              });
            console.log('we set the drivers new data ', res);
            const set = () => {
              this.setState({
                atUser: false,
              });
            };
            set();
          } catch (e) {
            console.error(e);
          }
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
          this.clearLocationInterval();
          const checkInterval = setInterval(async () => {
            let response;
            const { assignedDriver } = this.props;
            const { driverLocation, driving } = this.state;
            if (assignedDriver)
              try {
                // update driver location
                // driverLocation
                if (driverLocation && driving)
                  try {
                    await axios.put(backendRoutes.DRIVERS, {
                      username: assignedDriver.username,
                      currentLatitude: driverLocation.lat,
                      currentLongitude: driverLocation.lng,
                    });
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
                if (assignedDriver) {
                  const lastNum = currentDestination;
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
                  if (
                    (lastNum === 1 && currentDestination === 2) ||
                    (lastNum === 0 && currentDestination === 3)
                  ) {
                    this.setState({
                      discount: 10,
                      discountReason:
                        'because we picked up a second passenger on our way to our destination.',
                      snackbarMessage:
                        'Rerouting to pick up more passengers. You will get a discount.',
                      snackbarOpen: true,
                    });
                  }
                  if (lastNum === 2 && currentDestination === 3) {
                    this.setState({
                      discount: 5,
                      discountReason:
                        'because we picked up a second passenger while on our way to pick you up.',
                      snackbarMessage:
                        'Picking up someone else first. Thank you for your patience. You will get a discount.',
                      snackbarOpen: true,
                    });
                  }
                }
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
                this.setState({ driving: true });

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
                    this.setState({ driving: false });
                    if (
                      Math.abs(parseFloat(lat, 10) - userLocation.lat) <
                        0.001 &&
                      Math.abs(parseFloat(lng, 10) - userLocation.lng) < 0.001
                    ) {
                      console.log('showing at user dialog');
                      this.setState({
                        destNumToRemove: destNum,
                        atUserDialogShow: true,
                      });
                      this.doCleartoUserInterval();
                    }
                    if (destNum === 1) {
                      // final destination
                      this.setState({ atDestinationDialogShow: true });
                      this.doCleartoUserInterval();
                      try {
                        axios.post(backendRoutes.ARRIVED, {
                          location: this.props.to,
                        });
                        console.log('success');
                        // TODO: reset frontend to prepare for other trip. Leave ratings?
                      } catch (e) {
                        // something went wrong.
                        console.error(e);
                        console.error(e.response);
                      }
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
)(props => <MainComponent {...props} />);

export default GMapsControl;
