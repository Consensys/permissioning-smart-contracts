// Libs
import React from "react";
// Components
import Dashboard from "../../components/Dashboard/Dashboard";
// Context
import { useData } from "../../context/data";

const DashboardContainer = () => {
    const { dataReady } = useData();

    return <Dashboard dataReady={dataReady} />;
};

export default DashboardContainer;
