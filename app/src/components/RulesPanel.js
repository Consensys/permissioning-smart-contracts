import React from 'react'
import { newContextComponents } from "drizzle-react-components";
import {hexToEnode} from '../util/enodetools';
import EnodeForm from './EnodeForm';

const { ContractForm } = newContextComponents;

class RulesPanel extends React.Component {
    state = { 
        rulesCountKey: null,
        rulesCount: 0,
        rules: []
    };

    componentDidMount() {
        const { drizzle } = this.props;
        const Rules = drizzle.contracts.Rules;

        this.setState({
            rulesCountKey: Rules.methods.getKeyCount.cacheCall()
        })
    }

     rulesCount = () => {
        const Rules = this.props.drizzleState.contracts.Rules;
        let count = Rules.getKeyCount[this.state.rulesCountKey] ?
            Rules.getKeyCount[this.state.rulesCountKey].value : 0
        return count;
     }

     rules = () => {
        const Rules = this.props.drizzle.contracts.Rules;
        const rulesCount = this.rulesCount();
         
        for(var i = 0; i < rulesCount; i++) {
            Rules.methods.getWhitelistKey(i).call()
                .then((result) => {
                    if (result) {
                        let enode = hexToEnode(result)
                        if (!this.state.rules.includes(enode)) {
                            this.setState(prevState => ({
                                rules: [...prevState.rules, enode]
                              }))
                        }
                    }
            });
        }
     }

     render() {
        const { drizzle, drizzleState } = this.props;
        const Rules = this.props.drizzleState.contracts.Rules;

        {this.rules()}
        const listItems = this.state.rules.map((r) =>
            <li key={r}>{r}</li>
        );
        
        return(
            <div className="section">
                <h1>Permissioning Rules</h1>

                <h2>Active Whitelist ({this.rulesCount()})</h2>
                <ul>{listItems}</ul>

                <h2>Add node to Whitelist</h2>
                <p>Adds the node represented by the input enode URL in the node whitelist.</p>
                <ContractForm 
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    contract="Rules" 
                    method="addEnode"/>

                <h2>Remove node from Whitelist</h2>
                <p>Adds the node represented by the input enode URL in the node whitelist.</p>
                <ContractForm 
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    contract="Rules" 
                    method="removeEnode"/>

                {/* TODO implement callback */}
                <EnodeForm 
                    drizzle={drizzle}
                    drizzleState={drizzleState}/>
            </div>
        );
    }
}

export default RulesPanel
