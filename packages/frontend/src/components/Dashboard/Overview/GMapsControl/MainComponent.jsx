// @flow
import React, { Fragment } from 'react';
import { GoogleMap, Polyline, TrafficLayer, Marker } from 'react-google-maps';
import AlertDialog from '../AlertDialog';
import { DrawMarker, DrawUserPosition } from './Drawing';
import SimpleSnackbar from '../SimpleSnackbar';
import { estimateCost } from '../CostEstimater';
import DrawnCarMarkers from './DrawnCarMarkers';

type Props = any;

const MainComponent = (props: Props) => {
  const {
    allDrivers,
    atDestinationDialogShow,
    atUserDialogShow,
    boundsDriver,
    coords,
    data,
    directions,
    discount,
    distance,
    driverLocation,
    driverRotation,
    discountReason,
    onArrivalToDestinationDialogClosed,
    onDriverArrivedDialogClosed,
    snackbarOpen,
    snackbarMessage,
  } = props;

  return (
    <Fragment>
      <AlertDialog
        open={atUserDialogShow}
        title="Driver arrived"
        text="Your driver has arrived"
        onClose={onDriverArrivedDialogClosed}
      />
      <SimpleSnackbar open={snackbarOpen} message={snackbarMessage} />
      {!distance ? null : (
        <AlertDialog
          open={atDestinationDialogShow}
          title="Arrived"
          text={`You have arrived at your destination! Your credit card was charged $${(
            estimateCost(distance.value) - (discount || 0)
          ).toFixed(2)}. ${
            discount
              ? `You received a discount of $${discount} ${discountReason}`
              : ''
          }`}
          onClose={() => {
            onArrivalToDestinationDialogClosed(
              estimateCost(distance.value - (discount || 0).toFixed(2))
            );
          }}
        />
      )}
      <GoogleMap
        ref={map => (map && boundsDriver ? map.fitBounds(boundsDriver) : null)}
        defaultZoom={11}
        defaultCenter={new google.maps.LatLng(37.3352, -121.8811)}
      >
        <TrafficLayer autoUpdate />
        <DrawUserPosition coords={coords} directions={directions} />
        {!directions ? null : (
          <Fragment>
            <Polyline
              path={directions}
              geodesic
              options={{
                strokeColor: '#0e0eff',
                strokeOpacity: 0.8,
                strokeWeight: 5,
                clickable: false,
              }}
            />

            <DrawMarker coords={data.from} />
            <DrawMarker coords={data.to} />
            {!driverLocation ? null : (
              <Marker
                position={
                  new google.maps.LatLng(driverLocation.lat, driverLocation.lng)
                }
                optimized={false}
                icon={{
                  path:
                    'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805zz',
                  fillColor: 'red',
                  anchor: { x: 25, y: 26 },
                  rotation: driverRotation,
                  strokeColor: 'black',
                  strokeWeight: 1,
                  scale: 0.6,
                  fillOpacity: 1,
                }}
              />
            )}
          </Fragment>
        )}
        <DrawnCarMarkers allDrivers={allDrivers} />
      </GoogleMap>
    </Fragment>
  );
};

export default MainComponent;
