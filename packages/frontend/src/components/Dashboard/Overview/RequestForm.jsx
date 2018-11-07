// @flow
import React, { Component } from 'react';

import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import LocationPicker from './LocationPicker';

type Props = {
  sendRequestToAirport: func,
  sendRequestFromAirport: func,
  haveUserPosition: boolean,
  disableRequestButtons: boolean,
};

export default class RequestForm extends Component<Props> {
  state = {
    value: 0,
  };

  handleChange = (e, val) => this.setState({ value: val });

  render() {
    const { value } = this.state;
    const {
      sendRequestToAirport,
      sendRequestFromAirport,
      haveUserPosition,
      disableRequestButtons,
    } = this.props;
    console.log('have user position? ', haveUserPosition);
    return (
      <div className="requestFormToggleLocation">
        <ToggleButtonGroup value={value} exclusive onChange={this.handleChange}>
          <ToggleButton value={1}>To Airport</ToggleButton>
          <ToggleButton value={2}>To Home</ToggleButton>
        </ToggleButtonGroup>
        <LocationPicker
          show={value}
          sendRequestToAirport={sendRequestToAirport}
          sendRequestFromAirport={sendRequestFromAirport}
          haveUserPosition={haveUserPosition}
          disableRequestButtons={disableRequestButtons}
        />
      </div>
    );
  }
}
