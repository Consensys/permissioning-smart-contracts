import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, IconButton, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Typography } from "@material-ui/core";
import { Add, Delete } from '@material-ui/icons';

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
    },
  });

class AdminPage extends Component {
  _isMounted = false;

  state = {
    selectedAddress: '',
    getAdminsKey: null,
    addPopupOpen: false,
    addTextField: '',
  };

  componentDidMount() {
    this._isMounted = true;
    const { drizzle, drizzleState } = this.props;
    const Admin = drizzle.contracts.Admin;

    // check if current account is admin
    Admin.methods.isAuthorized(drizzleState.accounts[0]).call().then((result) => {
      if (this._isMounted) {
        this.setState({
          selectedAddress: drizzleState.accounts[0],
          isAdmin: result
        });
      }
    });

    // check if newly selected account is admin
    drizzle.web3.currentProvider.publicConfigStore.on('update', (e) => {
      Admin.methods.isAuthorized(e.selectedAddress).call().then((result) => {
        if (this._isMounted) {
          this.setState({
            selectedAddress: e.selectedAddress,
            isAdmin: result
        });
        }
      });
    });

    this.setState({
      getAdminsKey: Admin.methods.getAdmins.cacheCall(),
    })
 }

 componentWillUnmount() {
  this._isMounted = false;
}

 getAdmins = () => {
  const { getAdminsKey } = this.state;
  const Admin = this.props.drizzleState.contracts.Admin;
  return Admin.getAdmins[getAdminsKey] ? Admin.getAdmins[getAdminsKey].value : []
}

  handleRemove = (i) => {
    const Admin = this.props.drizzle.contracts.Admin;
    var adminToBeRemoved = this.getAdmins()[i]
    Admin.methods.removeAdmin.cacheSend(adminToBeRemoved, { from: this.props.drizzleState.accounts[0] });
  }

  handleClickOpen = () => {
    this.setState({ addPopupOpen: true });
  };

  handleClose = () => {
    this.setState({ addPopupOpen: false });
  };

  handleSubmit = () => {
    const Admin = this.props.drizzle.contracts.Admin;
    const accountToAdd = this.state.addTextField
    if (accountToAdd && accountToAdd !== '') {
      Admin.methods.addAdmin.cacheSend(accountToAdd, { from: this.props.drizzleState.accounts[0] });
    }
    this.handleClose()
  };

  renderTable = (isAdmin) => {
    const admins = this.getAdmins();

    if (admins) {
      return admins.map((row, i) => (
        <TableRow key={i}>
          <TableCell component="th" scope="row">{row}</TableCell>
            <TableCell align="right">
            { isAdmin && this.renderDeleteButton(row, i) }
            </TableCell>
          </TableRow>
      ))
    }
  }

  renderDeleteButton = (account, index) => {
    const { drizzleState, classes } = this.props;
    if (drizzleState.accounts[0] !== account) {
      return (
        <IconButton
              className={classes.button}
              aria-label="Delete"
              onClick={() => this.handleRemove(index)}>
              <Delete />
            </IconButton>
      )
    }
  }

  render() {
    const { classes } = this.props;
    const isAdmin = this.state.isAdmin;

    return (
      <div>
        <Typography variant="h4" color="inherit">
          Admin Accounts
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Account Address</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { this.renderTable(isAdmin) }
            </TableBody>
          </Table>
        </Paper>
        {
          isAdmin &&
          (<Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.handleClickOpen}>
              <Add />
          </Fab>)
        }
        <Dialog
          open={this.state.addPopupOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Admin Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              An admin account can edit admin accounts and permissioning rules. Only add accounts that you trust.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Ethereum Account"
              fullWidth
              onChange={(e) => { this.setState({ addTextField: e.target.value }) }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.handleSubmit}
              color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      );
  }
}

export default withStyles(styles)(AdminPage);