import React from 'react'
import { newContextComponents } from "drizzle-react-components";
import { DrizzleContext } from "drizzle-react";

const { AccountData, ContractData, ContractForm } = newContextComponents;

class AdminPanel extends React.Component {
    componentDidMount() {
        //access drizzle props within componentDidMount
        
     }

    render() {
        const { drizzle, drizzleState } = this.props;

        return (
            <div className="section">
                <h1>Admin Accounts</h1>
                <p>Only an account in the admin list can add and remove node permissioning rules.</p>

                <h2>Admin Accounts List</h2>
                <ContractData 
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    contract="Rules" 
                    method="getAllAdmins"/>

                <h2>Add account</h2>
                <p>Add an account to the admin accounts list. Only admin account can add or remove accounts to the admin
                    list.</p>
                <ContractForm 
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    contract="Rules" 
                    method="addAdmin"/>

                <h2>Remove account</h2>
                <p>Remove an account from the admin accounts list. The removed account won't be allowed to change
                    permissioning rules.</p>
                <ContractForm 
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    contract="Rules" 
                    method="removeAdmin"/>
            </div>
        );
    }
}

export default AdminPanel
