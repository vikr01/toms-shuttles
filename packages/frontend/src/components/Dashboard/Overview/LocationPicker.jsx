// @flow
import React, { Component, Fragment } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  RadioGroup,
  Radio,
  Button,
  FormLabel,
  Typography,
} from '@material-ui/core';
import MyStandaloneSearchBox from './MyStandaloneSearchBox';

type Props = {
  show: int,
  sendRequestToAirport: func,
  sendRequestFromAirport: func,
};

export default class LocationPicker extends Component<Props> {
  state = {
    value: '',
    enteredLocation: null,
    destinationSet: false,
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleLocationEnteredChange = (lat, lng) => {
    console.log(lat, lng);
    this.setState({ enteredLocation: { lat, lng }, destinationSet: true });
  };

  render() {
    const { show, sendRequestToAirport, sendRequestFromAirport } = this.props;
    const { value, enteredLocation, destinationSet } = this.state;
    if (show) {
      if (show === 1) {
        return (
          <Fragment>
            <RadioGroup value={value} onChange={this.handleChange}>
              <Typography variant="h5">
                Select airport you wish to go to
              </Typography>
              <FormControlLabel value="SFO" control={<Radio />} label="SFO" />
              <FormControlLabel value="OAK" control={<Radio />} label="OAK" />
              <FormControlLabel value="SJC" control={<Radio />} label="SJC" />
            </RadioGroup>
            <Button
              variant="contained"
              disabled={value === ''}
              onClick={() => sendRequestToAirport(value)}
            >
              Show route
            </Button>
          </Fragment>
        );
      }
      if (show === 2) {
        return (
          <Fragment>
            <br />
            <Typography variant="h5">
              Select airport you are located at
            </Typography>
            <RadioGroup value={value} onChange={this.handleChange}>
              <FormControlLabel value="SFO" control={<Radio />} label="SFO" />
              <FormControlLabel value="OAK" control={<Radio />} label="OAK" />
              <FormControlLabel value="SJC" control={<Radio />} label="SJC" />
            </RadioGroup>
            <Typography variant="h5">Enter your destination</Typography>
            <MyStandaloneSearchBox
              onSet={(lat, lng) => this.handleLocationEnteredChange(lat, lng)}
            />
            <Button
              variant="contained"
              disabled={value === '' || !destinationSet}
              onClick={() =>
                sendRequestFromAirport(
                  value,
                  enteredLocation.lat,
                  enteredLocation.lng
                )
              }
            >
              Show route
            </Button>
          </Fragment>
        );
      }
    }

    return null;
  }
}
