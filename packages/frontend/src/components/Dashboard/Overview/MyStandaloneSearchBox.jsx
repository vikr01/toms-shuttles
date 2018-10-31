// @flow
import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { withScriptjs } from 'react-google-maps';
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox';

const MyStandaloneSearchbox = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDdFTrNJ3AHz6_978tDmRvRYXbdBHVRLWI&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};
      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          this.setState({
            places,
          });
        },
      });
    },
    componentDidUpdate(prevProps, prevState) {
      if (prevState !== this.state) {
        const nextMarkers = this.state.places.map(place => ({
          position: place.geometry.location,
        }));
        this.props.onSet(
          nextMarkers[0].position.lat(),
          nextMarkers[0].position.lng()
        );
      }
    },
  }),
  withScriptjs
)((props, state) => (
  <div data-standalone-searchbox="">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Enter destination"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `340px`,
          height: `32px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </StandaloneSearchBox>
    {state.places && <ol>OK</ol>}
  </div>
));

export default MyStandaloneSearchbox;
