/* global google */
// @flow
import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';

import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  DirectionsRenderer,
  TrafficLayer,
} from 'react-google-maps';

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
    async componentWillMount() {
      await this.setState({
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
                await routeSet(
                  result.routes[0].legs[0].duration,
                  result.routes[0].legs[0].distance
                );
                this.setState({
                  directions: result,
                });
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
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new google.maps.LatLng(37.3352, -121.8811)}
  >
    <TrafficLayer autoUpdate />
    {props.route && props.onDirectionChange()}
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

export default GMapsControl;
