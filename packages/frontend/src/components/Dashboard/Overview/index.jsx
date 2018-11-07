// @flow
import React, { Fragment } from 'react';
import { Paper } from '@material-ui/core';
import MapView from './MapView';
import DriverMapView from './Driver/DriverMapView';

type OverviewViewProps = {
  accountType: string,
};

class OverviewView extends React.Component<OverviewViewProps> {
  state = { showMap: true };

  doRequest() {
    this.setState({ showMap: true });
  }

  render() {
    const { showMap } = this.state;
    const { accountType } = this.props;
    return (
      <Fragment>
        <Paper className="paperDashboard">
          <DisplayDashboardContent
            showMap={showMap}
            accountType={accountType}
            doRequest={this.doRequest}
          />
        </Paper>
      </Fragment>
    );
  }
}

type DisplayDashboardContentProps = {
  accountType: string,
  showMap: boolean,
  doRequest: func,
};

const DisplayDashboardContent = ({
  accountType,
  showMap,
  doRequest,
}: DisplayDashboardContentProps) => {
  console.log('accountType: ', accountType);
  if (accountType === 'Client') {
    return <MapView showMap={showMap} startRequest={() => doRequest()} />;
  }
  if (accountType === 'Driver') {
    return <DriverMapView showMap={showMap} />;
  }
  return null;
};

export default OverviewView;
