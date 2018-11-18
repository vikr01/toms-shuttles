// @flow
import React from 'react';
import { Marker } from 'react-google-maps';

type DrawMarkerProps = {
  coords: Object,
};

export const DrawMarker = ({ coords }: DrawMarkerProps) => {
  if (!coords) return null;
  return <Marker position={new google.maps.LatLng(coords.lat, coords.lng)} />;
};

export const DrawCarMarker = ({ coords }: DrawMarkerProps) => {
  if (!coords) return null;
  return (
    <Marker
      position={new google.maps.LatLng(coords.lat, coords.lng)}
      optimized={false}
      icon={{
        path:
          'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805zz',
        fillColor: 'blue',
        anchor: { x: 25, y: 26 },
        strokeColor: 'black',
        strokeWeight: 1,
        scale: 0.6,
        fillOpacity: 1,
      }}
    />
  );
};

export const DrawUserPosition = ({ coords }: DrawMarkerProps) => {
  if (!coords) return null;
  return (
    <Marker
      position={new google.maps.LatLng(coords.latitude, coords.longitude)}
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

export default DrawUserPosition;
