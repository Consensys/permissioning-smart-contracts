import React, { Component } from "react";

import logo from "../pegasys-logo.png";
import AdminPanel from "./AdminPanel"
import RulesPanel from "./RulesPanel";
import ReadOnlyPanel from "./ReadOnlyPanel";

class PermissioningPage extends Component {
  render() {
    const { drizzle, drizzleState } = this.props;

    return(
      <div className="App">
      <div>
        <img src={logo} alt="pegasys-logo" />
        <h1>Pantheon Node Permissioning</h1>
      </div>

      <RulesPanel drizzle={drizzle} drizzleState={drizzleState}/>
      <AdminPanel drizzle={drizzle} drizzleState={drizzleState}/>
      <ReadOnlyPanel drizzle={drizzle} drizzleState={drizzleState}/>
    </div>
    )
  }
}

export default PermissioningPage