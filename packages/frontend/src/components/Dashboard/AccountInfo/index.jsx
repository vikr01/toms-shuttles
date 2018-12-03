// @flow
import React, { Fragment, Component } from 'react';
import axios from 'axios';
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  withStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import backendRoutes from 'toms-shuttles-backend/routes';
import routes from '../../../routes';

type ClientAccountProps = {
  creditInfo: string,
};

const obf = (str: string) => {
  const len = str.length - 4;
  return '*'.repeat(len) + str.substr(len);
};

const ClientAccount = ({ creditInfo }: ClientAccountProps) => (
  <Fragment>
    <TableCell>{obf(creditInfo) || 'No credit card info saved'}</TableCell>
  </Fragment>
);

type DriverAccountProps = {
  active: ?number,
  seatNumber: ?number,
};

const DriverAccount = ({ active, seatNumber }: DriverAccountProps) => {
  if (active === 0) {
    return (
      <Fragment>
        <TableCell>{seatNumber}</TableCell>
      </Fragment>
    );
  }
  if (active === 1) {
    return (
      <Fragment>
        <TableCell>Become inactive to change your seat count</TableCell>
      </Fragment>
    );
  }
  return null;
};

const AccountType = ({ accountType, ...otherProps }) => {
  if (accountType === 'Client') {
    return <ClientAccount {...otherProps} />;
  }
  if (accountType === 'Driver') {
    return <DriverAccount {...otherProps} />;
  }
  return null;
};

export default class AccountInfoView extends Component {
  state = {
    name: '',
    username: '',
    creditInfo: '',
    error: false,
    loaded: false,
  };

  async componentDidMount() {
    await this.populateState();
  }

  async populateState() {
    let response;
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              {accountType === 'Client' ? (
                <TableCell>Credit card</TableCell>
              ) : (
                <TableCell>Number of seats</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{name}</TableCell>
              <TableCell>{username}</TableCell>
              <AccountType
                {...{ accountType, active, creditInfo, seatNumber }}
              />
            </TableRow>
          </TableBody>
        </Table>
        <div style={{ height: '20px' }} />
        {accountType === 'Client' ? (
          <Link to={routes.CREDITCARD_ADD} className="accountOverviewItem">
            Enter Credit card info
          </Link>
        ) : (
          <Link to={routes.CARSEATS_SET} className="accountOverviewItem">
            Change seat count
          </Link>
        )}
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
