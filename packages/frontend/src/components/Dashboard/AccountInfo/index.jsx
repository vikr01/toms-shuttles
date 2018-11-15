// @flow
import React, { Fragment, Component } from 'react';
import axios from 'axios';
import { Typography, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import routes from '../../../routes';

type Props = {};

type State = {
  name: string,
  username: string,
  creditInfo: string,
  error: boolean,
  loaded: boolean,
  accountType?: 'Client' | 'Driver',
  seatNumber: number,
  active?: number,
};

export default class AccountInfoView extends Component<Props, State> {
  props: Props;

  state: State = {
    name: '',
    username: '',
    creditInfo: '',
    error: false,
    loaded: false,
    seatNumber: 0,
  };

  async componentDidMount() {
    await this.populateState();
  }

  async populateState() {
    let response: any;
    try {
      response = await axios.get(backendRoutes.USER);
    } catch (error) {
      console.error(error);
      this.setState({ error: true, loaded: true });
      return;
    }
    console.log(response);
    this.setState({
      name: `${response.data.firstName} ${response.data.lastName}`,
      username: response.data.username,
      creditInfo: response.data.creditCard,
      accountType: response.data.accountType,
      seatNumber: response.data.driverInfo
        ? response.data.driverInfo.numOfSeats
        : 0,
      active: response.data.driverInfo ? response.data.driverInfo.active : 0,
      error: false,
      loaded: true,
    });
  }

  renderContent() {
    const {
      error,
      loaded,
      name,
      username,
      creditInfo,
      accountType,
      seatNumber,
      active,
    } = this.state;
    if (!loaded) {
      return (
        <Typography variant="h4" gutterBottom component="h2">
          Loading...
        </Typography>
      );
    }
    if (error) {
      return (
        <Typography variant="h4" gutterBottom component="h2">
          Unable to load user info
        </Typography>
      );
    }
    return (
      <Fragment>
        <Typography variant="h4" gutterBottom component="h2">
          Account details
        </Typography>
        <div>
          <Typography variant="h5" className="accountOverviewItem">
            {`Name: ${name}`}
          </Typography>
          <Typography variant="h5" className="accountOverviewItem">
            {`Username: ${username}`}
          </Typography>
          {accountType === 'Client' && (
            <Fragment>
              <Typography variant="h5" className="accountOverviewItem">
                {`Card number: ${creditInfo}`}
              </Typography>
              <Link to={routes.CREDITCARD_ADD} className="accountOverviewItem">
                Enter Credit card info
              </Link>
            </Fragment>
          )}
          {accountType === 'Driver' &&
            active === 0 && (
              <Fragment>
                <Typography variant="h5" className="accountOverviewItem">
                  {`Seat count: ${seatNumber}`}
                </Typography>
                <Link to={routes.CARSEATS_SET} className="accountOverviewItem">
                  Change seat count
                </Link>
              </Fragment>
            )}
          {accountType === 'Driver' &&
            active === 1 && (
              <Fragment>
                <Typography variant="h5" className="accountOverviewItem">
                  Become inactive to change your seat count
                </Typography>
              </Fragment>
            )}
        </div>
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        <Paper className="paperDashboard">{this.renderContent()}</Paper>
        <div className="rest" />
      </Fragment>
    );
  }
}
