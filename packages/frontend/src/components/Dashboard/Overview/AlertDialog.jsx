// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = {
  open?: boolean,
  onClose?: Function,
  onOpen?: Function,
  text: string,
  title: string,
};

type State = {
  open: boolean,
  closing: boolean,
};

export default class AlertDialog extends Component<Props, State> {
  props: Props;

  static defaultProps = {
    open: false,
    onClose: () => {},
    onOpen: () => {},
  };

  state: State = {
    open: false,
    closing: false,
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { open } = nextProps;
    if (open && !prevState.open && !prevState.closing) {
      return { open: true };
    }
    return prevState;
  }

  handleClickOpen = () => {
    const { onOpen } = this.props;
    this.setState({ open: true, closing: false });
    // $$FlowFixMe$$
    onOpen();
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({ open: false, closing: true });
    // $$FlowFixMe$$
    onClose();
    this.setState({ closing: false });
  };

  render() {
    const { open } = this.state;
    const { text, title } = this.props;
    return (
      <div>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
