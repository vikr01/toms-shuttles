// @flow
import React, { Component, Fragment } from 'react';
import { Button, CssBaseline, Paper, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import ValueForm from '../ValueForm';
import DisplayStatus from '../../../DisplayStatus';
import routes from '../../../../routes';

function countOk(count: int) {
  return count > 0 && count <= 10;
}

export default class CarSeatSet extends Component<Props> {
  state = {
    redirect: false,
    status: '',
  };

  sendToBackend = async count => {
    console.log('sending count to backend', count);
    try {
      await axios.put(backendRoutes.DRIVERS, { numOfSeats: count });
      this.setState({
        redirect: true,
        status: 'we got your seat count saved!',
      });
    } catch (e) {
      console.error(e);
      this.setState({ status: 'Issue connecting to server' });
    }
  };

  onSubmit = event => {
    event.preventDefault();
    const { elements: elem } = event.target;
    const { value: count } = elem.count;

    if (!countOk(count)) {
      this.setState({ status: 'Invalid count. Must be between 1 and 10' });
      return;
    }

    this.sendToBackend(count);
  };

  render() {
    const { redirect, status } = this.state;

    if (redirect) {
      return <Redirect push to={routes.DASHBOARD} />;
    }
    return (
      <Fragment>
        <CssBaseline />
        <Paper className="paper">
          <Typography variant="headline" className="textCenter">
            Set number of seats in your car
          </Typography>
          <form className="form" onSubmit={this.onSubmit}>
            <ValueForm name="count" value="Number of available seats" />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="submit"
            >
              Set
            </Button>
            <DisplayStatus status={status} />
          </form>
        </Paper>
      </Fragment>
    );
  }
}
