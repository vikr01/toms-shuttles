// @flow
import React, { Component, Fragment } from 'react';
import { Button, CssBaseline, Paper, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import backendRoutes from 'toms-shuttles-backend/routes';
import ValueForm from '../ValueForm';
import routes from '../../../../routes';
import AlertDialog from '../../Overview/AlertDialog';

function checkLuhn(card) {
  const nDigits = card.length;
  let nSum = 0;
  let isSecond = false;
  for (let i = nDigits - 1; i >= 0; i -= 1) {
    let d = parseInt(card.charAt(i), 10);
    if (isSecond) d *= 2;
    nSum += Math.floor(d / 10);
    nSum += d % 10;
    isSecond = !isSecond;
  }
  return nSum % 10 === 0;
}

function cardOk(card) {
  const len = card.length;
  const luhn = checkLuhn(card);
  if (card.match(/[^0-9]/g) !== null) {
    return { ok: false, status: 'Card number can only contain numbers' };
  }
  if (card.startsWith('3')) {
    // American Express
    return {
      ok: luhn && len === 15,
      status: !luhn
        ? 'This card fails the luhn test. Invalid card'
        : 'American express requires 15 numbers',
    };
  }
  if (card.startsWith('4') || card.startsWith('5') || card.startsWith('6')) {
    // Visa, Mastercard, Discover
    return {
      ok: luhn && len === 16,
      status: !luhn
        ? 'This card fails the luhn test. Invalid card'
        : 'Visa/Mastercard/Discover requrires 16 numbers',
    };
  }
  return { ok: false, status: 'your credit card must start with 3, 4, 5 or 6' };
}

export default class CreditCardAdd extends Component<Props> {
  state = {
    redirect: false,
    status: '',
    showOkDialog: false,
    showErrorDialog: false,
  };

  sendToBackend = async card => {
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

  onSubmit = event => {
    event.preventDefault();
    const { elements: elem } = event.target;
    const { value: card } = elem.card;
    const { ok, status } = cardOk(card);
    console.log(ok, status);
    if (!ok)
      this.setState({
        showErrorDialog: true,
        status,
      });
    else this.sendToBackend(card);
  };

  onOkDialogClose = () => {
    this.setState({ redirect: true });
  };

  onErrorDialogClose = () => {
    this.setState({ showErrorDialog: false });
  };

  render() {
    const { redirect, status, showOkDialog, showErrorDialog } = this.state;

    if (redirect) {
      return <Redirect push to={routes.DASHBOARD} />;
    }
    return (
      <Fragment>
        <AlertDialog
          open={showOkDialog}
          onClose={this.onOkDialogClose}
          title=""
          text={status}
        />
        <AlertDialog
          open={showErrorDialog}
          onClose={this.onErrorDialogClose}
          title="Input error"
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
