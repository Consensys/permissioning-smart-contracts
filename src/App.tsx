// Libs
import React from 'react';
import ReactDOM from 'react-dom';
// Components
import Layout from './components/Layout/Layout';
import Initializer from './containers/Layout/Initializer';
import Dashboard from './containers/Dashboard/Dashboard';
import NoProviderFlash from './components/Flashes/NoProvider';
import WrongNetworkFlash from './components/Flashes/WrongNetwork';
// Theme
import theme from './constants/theme';
import { createTheme, ThemeProvider } from '@material-ui/core';
// Context
import { NetworkProvider } from './context/network';
import { Config, configPromise } from './util/configLoader';
import { ConfigDataProvider } from './context/configData';

export const initApp = async ({ target }: { target: HTMLElement }) => {
  const config = await configPromise;
  ReactDOM.render(<App config={config} />, target);
};

const App: React.FC<{ config: Config }> = ({ config }) => (
  <ConfigDataProvider config={config}>
    <ThemeProvider theme={createTheme(theme)}>
      <NetworkProvider>
        <Layout>
          <Initializer NoProvider={NoProviderFlash} WrongNetwork={WrongNetworkFlash}>
            <Dashboard />
          </Initializer>
        </Layout>
      </NetworkProvider>
    </ThemeProvider>
  </ConfigDataProvider>
);

export default App;
