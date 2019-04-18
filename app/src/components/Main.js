import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DrizzleContext } from "drizzle-react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { AppBar, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon,
    ListItemText, Toolbar, Typography } from "@material-ui/core";
import { AssignmentInd, ChevronLeft, ImportExport, Menu } from '@material-ui/icons';
import RulesPage from './RulesPage';
import AdminPage from './AdminPage';

const drawerWidth = 260;
const styles = theme => ({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 20,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  });

  function Rules() {
    return (
      <DrizzleContext.Consumer>
          {drizzleContext => {
              const { drizzle, drizzleState } = drizzleContext;
              return (
                  <RulesPage drizzle={drizzle} drizzleState={drizzleState}/>
              );
          }}
      </DrizzleContext.Consumer>
    )
  }

  function Admin() {
    return (
      <DrizzleContext.Consumer>
          {drizzleContext => {
              const { drizzle, drizzleState } = drizzleContext;
              return (
                  <AdminPage drizzle={drizzle} drizzleState={drizzleState}/>
              );
          }}
      </DrizzleContext.Consumer>
    )
  }

class Main extends React.Component {

    state = {
        drawerOpen: false,
        readOnly: false,
        link: '/admin/'
    }

    toggleDrawer = (open) => {
        this.setState({
            drawerOpen: open,
        });
    };

    render() {
        const { classes } = this.props;
        const { drawerOpen } = this.state;

        return (
            <div className={classes.root}>
            <Router>
                <CssBaseline>
                    <AppBar
                        position="fixed"
                        className={classNames(classes.appBar, {
                            [classes.appBarShift]: drawerOpen,
                        })}>
                        <Toolbar disableGutters={!drawerOpen}>
                            <IconButton
                                color="inherit"
                                aria-label="Menu"
                                onClick={() => this.toggleDrawer(true)}
                                className={classNames(classes.menuButton, drawerOpen && classes.hide)}>
                            <Menu />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.grow}>
                            Pantheon Node Permissioning
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Drawer
                        className={classes.drawer}
                        variant="persistent"
                        anchor="left"
                        open={drawerOpen}
                        classes={{
                            paper: classes.drawerPaper,
                        }}>
                      <div className={classes.drawerHeader}>
                          <IconButton onClick={() => this.toggleDrawer(false)}>
                          <ChevronLeft />
                          </IconButton>
                      </div>
                      <Divider />
                      <div className={classes.list}>
                          <List>
                              <ListItem
                                  button
                                  key='rules'
                                  component={Link}
                                  to='/rules/'
                                  onClick={() => this.toggleDrawer(false)}>
                                  <ListItemIcon><ImportExport /></ListItemIcon>
                                  <ListItemText
                                    primary='Permissioning Rules'/>
                              </ListItem>
                              <ListItem
                                  button
                                  key='admin'
                                  component={Link}
                                  to='/admin/'
                                  onClick={() => this.toggleDrawer(false)}>
                                  <ListItemIcon><AssignmentInd /></ListItemIcon>
                                  <ListItemText primary='Admin Accounts' />
                              </ListItem>
                          </List>
                          <Divider/>
                      </div>
                    </Drawer>

                    <main className={classNames(classes.content, {[classes.contentShift]: drawerOpen})}>
                        <div className={classes.drawerHeader} />
                            <Route path="/" exact component={Rules} />
                            <Route path="/rules" exact component={Rules} />
                            <Route path="/admin" component={Admin} />
                        </main>
                    </CssBaseline>
                </Router>
            </div>
        );
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);

