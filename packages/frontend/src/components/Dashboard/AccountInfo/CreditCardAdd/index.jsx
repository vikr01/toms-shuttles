// @flow
import React, { Component, Fragment } from 'react';
import { Button, CssBaseline, Paper, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import ValueForm from '../ValueForm';
import DisplayStatus from '../../../DisplayStatus';
import routes from '../../../../routes';

function cardOk(card: string) {
  const len = card.length;
  if (card.startsWith('3'))
    // American Express
    return len === 15;
  if (card.startsWith('4') || card.startsWith('5') || card.startsWith('6'))
    // Visa, Mastercard, Discover
    return len === 16;
  return false;
}

export default class CreditCardAdd extends Component<Props> {
  state = {
    redirect: false,
    status: '',
  };

  sendToBackend = async card => {
    console.log('sending card to backend', card);
    try {
      await axios.post(backendRoutes.ADDCREDITCARD, card);
      this.setState({ redirect: true, status: 'we got your card saved!' });
    } catch (e) {
      this.setState({ status: 'Issue connecting to server' });
    }
  };

  onSubmit = event => {
    event.preventDefault();
    const { elements: elem } = event.target;
    const { value: card } = elem.card;

    if (!cardOk(card)) {
      this.setState({ status: 'Invalid card number' });
      return;
    }

    this.sendToBackend(card);
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
            Add Credit card
          </Typography>
          <form className="form" onSubmit={this.onSubmit}>
            <ValueForm name="card" value="Credit card number" />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="submit"
            >
              Add
            </Button>
            <DisplayStatus status={status} />
          </form>
        </Paper>
      </Fragment>
    );
  }
}
