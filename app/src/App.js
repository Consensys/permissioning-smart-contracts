// Libs
import React from "react";
import { Drizzle, generateStore } from 'drizzle';
import { DrizzleContext } from "drizzle-react";
import { ThemeProvider } from "styled-components";
// Components
import Main from "./components/Main";
// Theme
import theme from "./constants/theme";
// Drizzle configuration
import drizzleOptions from "./drizzleOptions";
const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

const App = () => (
  <DrizzleContext.Provider drizzle={drizzle}>
    <ThemeProvider theme={theme}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
          }

          return (
            <Main />
          );
        }}
      </DrizzleContext.Consumer>
    </ThemeProvider>
  </DrizzleContext.Provider>
);

export default App;
