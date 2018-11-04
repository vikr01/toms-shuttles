// @flow
import React, { Fragment, Component } from 'react';
import axios from 'axios';
import { Typography, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import routes from '../../../routes';

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
      creditInfo: response.data.creditInfo,
      accountType: response.data.accountType,
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
          AccountInfoView
        </Typography>
        <div>
          <Typography variant="h5" className="accountOverviewItem">
            Name: {name}
          </Typography>
          <Typography variant="h5" className="accountOverviewItem">
            Username: {username}
          </Typography>
          {accountType === 'User' && (
            <Fragment>
              <Typography variant="h5" className="accountOverviewItem">
                Card number: {creditInfo}
              </Typography>
              <Link to={routes.CREDITCARD_ADD} className="accountOverviewItem">
                Enter Credit card info
              </Link>
            </Fragment>
          )}
          {accountType === 'Driver' && (
            <Fragment>
              <Link to={routes.CARSEATS_SET} className="accountOverviewItem">
                Change seat count
              </Link>
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
