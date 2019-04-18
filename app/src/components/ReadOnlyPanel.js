import React from 'react'

class ReadOnlyPanel extends React.Component {
    state = {
        isReadOnlyKey: null 
    };

    componentDidMount() {
        const { drizzle } = this.props;
        const Rules = drizzle.contracts.Rules;

        const isReadOnlyKey = Rules.methods.isReadOnly.cacheCall();
        this.setState({isReadOnlyKey: isReadOnlyKey})
     }

    toggleReadOnlyMode = () => {
        const Rules = this.props.drizzle.contracts.Rules;
        const isReadOnly = this.isReadOnly();

        if (isReadOnly) {
            Rules.methods.exitReadOnly.cacheSend();
        } else {
            Rules.methods.enterReadOnly.cacheSend();
        }
    }

    isReadOnly = () => {
        const Rules = this.props.drizzleState.contracts.Rules;
        return Rules.isReadOnly[this.state.isReadOnlyKey] && Rules.isReadOnly[this.state.isReadOnlyKey].value;
    }

    readOnlyStyle = () => {
        if (this.isReadOnly()) {
            return { color: 'green'}
        } else {
            return { color: 'red'}
        }
    }

    render() {
        const isReadOnly = this.isReadOnly();
        
        return(
            <div className="section">
                <h1>Read Only Mode</h1>
                <p>When the Rules contract is in read only mode, permissioning rules cannot be created or deleted. Change the contract to edit mode before editing any permissioning rules.</p>
                <p>Contract is in <b style={ this.readOnlyStyle() }>{ isReadOnly ? 'READ ONLY' : 'EDIT' }</b> mode</p>
                <button onClick={ this.toggleReadOnlyMode }>{ isReadOnly ? 'Enable EDIT mode' : 'Enable READ ONLY mode' }</button>
            </div>
        );
    }
}

export default ReadOnlyPanel
