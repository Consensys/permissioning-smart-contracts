// Libs
import React from "react";
import PropTypes from "prop-types";
// Components
import LoadingPage from "../../components/LoadingPage/LoadingPage";

const Dashboard = ({ dataReady }) =>
    !dataReady ? <LoadingPage /> : <div>Ready</div>;

Dashboard.propTypes = {
    dataReady: PropTypes.bool.isRequired
};

export default Dashboard;
