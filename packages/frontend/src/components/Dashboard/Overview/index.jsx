// @flow
import React, { Fragment } from 'react';
import { Paper } from '@material-ui/core';
import MapView from './MapView';
import DriverMapView from './Driver/DriverMapView';

type OverviewViewProps = {
  accountType: ?('Client' | 'Driver'),
};

type OverviewViewState = {
  showMap: boolean,
};

class OverviewView extends React.Component<
  OverviewViewProps,
  OverviewViewState
> {
  props: OverviewViewProps;

  state: OverviewViewState = { showMap: true };

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
  accountType: ?('Client' | 'Driver'),
  showMap: boolean,
  doRequest: Function,
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
