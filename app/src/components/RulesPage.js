import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, IconButton, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography } from "@material-ui/core";
import { enodeToParams, isSameEnodeList } from '../util/enodetools';
import { Add, Delete } from '@material-ui/icons';
import ReadOnlyToggle from "./ReadOnlyToggle";

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

class RulesPage extends Component {
  _isMounted = false;

  state = {
    selectedAddress: '',
    isAdminKey: null,
    rulesCountKey: null,
    isReadOnlyKey: null,
    rulesCount: 0,
    rules: [],
    addPopupOpen: false,
    addTextField: '',
  };

  componentDidMount() {
    this._isMounted = true;
    const { drizzle, drizzleState } = this.props;
    const { Admin, Rules } = drizzle.contracts;

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
        rulesCountKey: Rules.methods.getSize.cacheCall(),
        isReadOnlyKey: Rules.methods.isReadOnly.cacheCall()
    })
 }

componentWillUpdate() {
    const Rules = this.props.drizzle.contracts.Rules;
    const rulesCount = this.rulesCount();
    const { rules } = this.state;

    var promises = []
    var updatedRules = [];

    //TODO change to use cacheCall
    for(var i = 0; i < rulesCount; i++) {
      promises.push(
        Rules.methods.getByIndex(i).call()
            .then((result) => {
                if (result) {
                  //TODO fix IP display
                  let enode = {
                    nodeId: result.enodeHigh.substring(2).substring(0, 8) + '...' + result.enodeLow.substring(2).substring(56, 64),
                    ip: result.ip,
                    port: result.port,
                  }
                  updatedRules.push(enode);
                }
            })
      );
    }

    Promise.all(promises).then(() => {
      if (this._isMounted) {
        if ((rules.length <= 0 && updatedRules.length > 0) || !isSameEnodeList(updatedRules, rules)) {
          this.setState({
            rules: updatedRules,
            rulesCount: updatedRules.length,
          })
        }
      }
    })
}

componentWillUnmount() {
  this._isMounted = false;
}

rulesCount = () => {
  const Rules = this.props.drizzleState.contracts.Rules;
  let count = Rules.getSize[this.state.rulesCountKey] ?
      Rules.getSize[this.state.rulesCountKey].value : 0
  return count;
}

isReadOnly = () => {
  const Rules = this.props.drizzleState.contracts.Rules;
  return Rules.isReadOnly[this.state.isReadOnlyKey] && Rules.isReadOnly[this.state.isReadOnlyKey].value;
}

handleRemove = (i) => {
  const Rules = this.props.drizzle.contracts.Rules;
  const ruleToBeRemoved = this.state.rules[i];

  Rules.methods.removeEnode.cacheSend('0x' + ruleToBeRemoved.nodeId.substring(0, 64), '0x' + ruleToBeRemoved.nodeId.substring(64, 128),
  ruleToBeRemoved.ip, ruleToBeRemoved.port, { from: this.props.drizzleState.accounts[0] });
}

handleClickOpen = () => {
  this.setState({ addPopupOpen: true });
};

handleClose = () => {
  this.setState({ addPopupOpen: false });
};

handleSubmit = () => {
  const Rules = this.props.drizzle.contracts.Rules;
  const enodeURLToAdd = this.state.addTextField
  if (enodeURLToAdd && enodeURLToAdd !== '') {
    console.log('Create rules = ' + enodeURLToAdd)

    let enode = enodeToParams(enodeURLToAdd);
    Rules.methods.addEnode.cacheSend(enode[0], enode[1], enode[2], enode[3], { from: this.props.drizzleState.accounts[0] });
  }
  this.handleClose()
};

renderTable = (isEditable) => {
  const { classes } = this.props;
  const { rules } = this.state;

  if (rules) {
    return rules.map((row, i) => (
      <TableRow key={i}>
        <TableCell component="th" scope="row">{row.nodeId}</TableCell>
        <TableCell align="left">{row.ip}</TableCell>
        <TableCell align="left">{row.port}</TableCell>
        <TableCell align="right">
          {
            isEditable && (
              <IconButton
                className={classes.button}
                aria-label="Delete"
                onClick={() => this.handleRemove(i)}>
                <Delete />
              </IconButton>
            )
          }
        </TableCell>
        </TableRow>
    ))
  }
}

render() {
  const { classes } = this.props;
  let isReadOnly = this.isReadOnly();
  let isAdmin = this.state.isAdmin;

  return (
    <div>
      <div>
        <Typography variant="h4" color="inherit">
          Active Rules
        </Typography>
        <ReadOnlyToggle
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
          isAdmin={this.state.isAdmin}/>
      </div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Node ID</TableCell>
              <TableCell align="left">IP</TableCell>
              <TableCell align="left">Port</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { this.renderTable(!isReadOnly && isAdmin) }
          </TableBody>
        </Table>
      </Paper>
      {
        !isReadOnly && isAdmin && (
          <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.handleClickOpen}>
            <Add />
          </Fab>
        )
      }
      <Dialog
          open={this.state.addPopupOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create Permissioning Rule</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Adds a node to the whitelist. A node can connect to another node if they both are in the whitelist.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Enode URL"
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

export default withStyles(styles)(RulesPage);