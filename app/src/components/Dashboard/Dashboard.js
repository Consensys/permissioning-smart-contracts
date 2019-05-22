// Libs
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// Components
import LoadingPage from "../LoadingPage/LoadingPage";
import TabSelector from "./TabSelector";
import AdminTab from "../../containers/Tabs/Admin";
// Constants
import { ADMIN_TAB } from "../../constants/tabs";

const Dashboard = ({ tab, setTab, dataReady }) => (
    <Fragment>
        <TabSelector setTab={setTab} tab={tab} />
        {!dataReady ? (
            <LoadingPage />
        ) : (
            <Fragment>
                <AdminTab isOpen={tab === ADMIN_TAB} />
                <div className="enodeTab" />
            </Fragment>
        )}
    </Fragment>
);

Dashboard.propTypes = {
    setTab: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
    dataReady: PropTypes.bool.isRequired
};

export default Dashboard;
