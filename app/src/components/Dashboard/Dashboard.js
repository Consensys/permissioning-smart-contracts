// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Components
import LoadingPage from "../../components/LoadingPage/LoadingPage";

const Dashboard = ({ dataReady }) => (
    <Fragment>{!dataReady ? <LoadingPage /> : <div>Ready</div>}</Fragment>
);

Dashboard.propTypes = {
    dataReady: PropTypes.bool.isRequired
};

export default Dashboard;
