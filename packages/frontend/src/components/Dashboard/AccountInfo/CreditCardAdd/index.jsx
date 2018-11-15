// @flow
import React, { Component, Fragment } from 'react';
import { Button, CssBaseline, Paper, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import ValueForm from '../ValueForm';
import routes from '../../../../routes';
import AlertDialog from '../../Overview/AlertDialog';

declare var backendRoutes: any;

type Card = string;

function cardOk(card: Card) {
  const len = card.length;
  if (card.startsWith('3'))
    // American Express
    return len === 15;
  if (card.startsWith('4') || card.startsWith('5') || card.startsWith('6'))
    // Visa, Mastercard, Discover
    return len === 16;
  return false;
}

type Props = {};

type State = {
  redirect: boolean,
  status: string,
  showOkDialog: boolean,
};

export default class CreditCardAdd extends Component<Props, State> {
  props: Props;

  state: State = {
    redirect: false,
    status: '',
    showOkDialog: false,
  };

  sendToBackend = async (card: Card) => {
    console.log('sending card to backend', card);
    try {
      await axios.post(backendRoutes.ADDCREDITCARD, { card });
      this.setState({ showOkDialog: true, status: 'we got your card saved!' });
    } catch (e) {
      this.setState({
        showOkDialog: true,
        status: 'Issue connecting to server',
      });
    }
  };

  onSubmit = (event: any) => {
    event.preventDefault();
    const { elements: elem } = event.target;
    const { value: card } = elem.card;

    if (!cardOk(card)) {
      this.setState({ status: 'Invalid card number' });
      return;
    }
    this.sendToBackend(card);
  };

  onDialogClose = () => {
    this.setState({ redirect: true });
  };

  render() {
    const { redirect, status, showOkDialog } = this.state;

    if (redirect) {
      return <Redirect push to={routes.DASHBOARD} />;
    }
    return (
      <Fragment>
        <AlertDialog
          open={showOkDialog}
          onClose={this.onDialogClose}
          title=""
          text={status}
        />
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
          </form>
        </Paper>
      </Fragment>
    );
  }
}
