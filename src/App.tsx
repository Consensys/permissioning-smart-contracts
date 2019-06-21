// Libs
import React from "react";
import { ThemeProvider } from "styled-components";
// Components
import Layout from "./components/Layout/Layout";
import Initializer from "./containers/Layout/Initializer";
import Dashboard from "./containers/Dashboard/Dashboard";
import NoProviderFlash from "./components/Flashes/NoProvider";
import WrongNetworkFlash from "./components/Flashes/WrongNetwork";
// Theme
import theme from "./constants/theme";
// Context
import { NetworkProvider } from "./context/network";
import { DataProvider } from "./context/data";

const App: React.FC = () => (
    <ThemeProvider theme={theme}>
        <NetworkProvider>
            <Layout>
                <Initializer
                    NoProvider={NoProviderFlash}
                    WrongNetwork={WrongNetworkFlash}
                >
                    <DataProvider>
                        <Dashboard />
                    </DataProvider>
                </Initializer>
            </Layout>
        </NetworkProvider>
    </ThemeProvider>
);

export default App;