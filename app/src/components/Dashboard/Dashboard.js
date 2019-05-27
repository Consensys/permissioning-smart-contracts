// Libs
import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
// Components
import LoadingPage from "../LoadingPage/LoadingPage";
import TabSelector from "./TabSelector";
import Toasts from "../../containers/Toasts/Toasts";
import AccountTab from "../../containers/Tabs/Account";
import AdminTab from "../../containers/Tabs/Admin";
import EnodeTab from "../../containers/Tabs/Enode";
// Context
import { ToastProvider } from "../../context/toasts";
// Constants
import { ACCOUNT_TAB, ADMIN_TAB, ENODE_TAB } from "../../constants/tabs";

const Dashboard = ({ tab, setTab, dataReady }) => (
    <Fragment>
        <TabSelector setTab={setTab} tab={tab} />
        {!dataReady ? (
            <LoadingPage />
        ) : (
            <ToastProvider>
                <Toasts />
                <AccountTab isOpen={tab === ACCOUNT_TAB} />
                <AdminTab isOpen={tab === ADMIN_TAB} />
                <EnodeTab isOpen={tab === ENODE_TAB} />
            </ToastProvider>
        )}
    </Fragment>
);

Dashboard.propTypes = {
    setTab: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
    dataReady: PropTypes.bool.isRequired
};

export default memo(Dashboard);
