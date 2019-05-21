// Libs
import React, { useState } from "react";
// Components
import Dashboard from "../../components/Dashboard/Dashboard";
// Context
import { useData } from "../../context/data";
// Constant
import { ADMIN_TAB } from "../../constants/tabs";

const DashboardContainer = () => {
    const [tab, setTab] = useState(ADMIN_TAB);
    const { dataReady } = useData();

    return <Dashboard tab={tab} setTab={setTab} dataReady={dataReady} />;
};

export default DashboardContainer;
