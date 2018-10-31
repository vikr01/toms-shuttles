// @flow
import React, { Fragment } from 'react';
import { Paper } from '@material-ui/core';
import MapView from './MapView';

class OverviewView extends React.Component {
  state = { showMap: false };

  doRequest() {
    this.setState({ showMap: true });
  }

  render() {
    const { showMap } = this.state;
    return (
      <Fragment>
        <Paper className="paperDashboard">
          <MapView showMap={showMap} startRequest={() => this.doRequest()} />
        </Paper>
      </Fragment>
    );
  }
}

export default OverviewView;
