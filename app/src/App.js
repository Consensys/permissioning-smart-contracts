import React, { Component } from "react";
import { Drizzle, generateStore } from 'drizzle';
import { DrizzleContext } from "drizzle-react";
import Main from "./components/Main";

import "./App.css";

import drizzleOptions from "./drizzleOptions";

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

class App extends Component {
  render() {
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
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
      </DrizzleContext.Provider>
    );
  }
}

export default App;