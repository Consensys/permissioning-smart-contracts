import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Fab, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import {hexToObject, isSameEnodeList} from '../util/enodetools';
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

class RulesPage extends Component {
  _isMounted = false;

  state = {
    rulesCountKey: null,
    rulesCount: 0,
    rules: []
  };

  componentDidMount() {
    this._isMounted = true;
    const { drizzle } = this.props;
    const Rules = drizzle.contracts.Rules;

    this.setState({
        rulesCountKey: Rules.methods.getSize.cacheCall()
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
                  //TODO fix IP parsing
                  let enode = {
                    nodeId: result.enodeHigh + result.enodeLow.substring(2),
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

renderTable = () => {
  const { classes } = this.props;
  const { rules } = this.state;

  if (rules) {
    return rules.map((row, i) => (
      <TableRow key={i}>
        <TableCell component="th" scope="row">{row.nodeId}</TableCell>
        <TableCell align="left">{row.ip}</TableCell>
        <TableCell align="left">{row.port}</TableCell>
        <TableCell>
          <IconButton
            className={classes.button}
            aria-label="Delete"
            onClick={() => this.handleRemove(i)}>
            <Delete />
          </IconButton>
        </TableCell>
        </TableRow>
    ))
  }
}

  handleRemove = (i) => {
    console.log('Remove row id = ' + i);
    const Rules = this.props.drizzle.contracts.Rules;
    const ruleToBeRemoved = this.state.rules[i];

    Rules.methods.removeEnode.cacheSend('0x' + ruleToBeRemoved.nodeId.substring(0, 64), '0x' + ruleToBeRemoved.nodeId.substring(64, 128), '0x' + ruleToBeRemoved.ipHex, ruleToBeRemoved.port);
  }

  render() {
    const { classes } = this.props;

    return (
        <div>
          <Typography variant="h4" color="inherit">
            Active Rules
          </Typography>
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
                { this.renderTable() }
              </TableBody>
            </Table>
          </Paper>
          <Fab color="primary" aria-label="Add" className={classes.fab}>
            <Add />
          </Fab>
        </div>
      );
  }
}

export default withStyles(styles)(RulesPage);