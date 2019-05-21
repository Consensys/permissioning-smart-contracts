// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Components
import LoadingPage from "../LoadingPage/LoadingPage";
import TabSelector from "./TabSelector";
// Constants
import { ADMIN_TAB, ENODE_TAB } from "../../constants/tabs";

const Dashboard = ({ tab, setTab, dataReady }) => (
    <Fragment>
        <TabSelector setTab={setTab} tab={tab} />
        {!dataReady ? (
            <LoadingPage />
        ) : tab === ADMIN_TAB ? (
            <div className="adminTable" />
        ) : tab === ENODE_TAB ? (
            <div className="enodeTable" />
        ) : null}
    </Fragment>
);

Dashboard.propTypes = {
    setTab: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
    dataReady: PropTypes.bool.isRequired
};

export default Dashboard;
