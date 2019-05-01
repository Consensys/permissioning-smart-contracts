import React, { Component } from 'react'
import { FormControlLabel, FormGroup, Switch } from '@material-ui/core/';

export default class ReadOnlyToggle extends Component {

    state = {
        isReadOnlyKey: '',
        isReadOnly: false,
    }

    componentDidMount() {
        const { drizzle } = this.props;
        const Rules = drizzle.contracts.Rules;

        const isReadOnlyKey = Rules.methods.isReadOnly.cacheCall();
        this.setState({isReadOnlyKey: isReadOnlyKey})
    }

    componentWillUpdate() {
        this.refreshReadOnlyState()
    }

    handleChange = (event) => {
        const Rules = this.props.drizzle.contracts.Rules;
        const { isReadOnly } = this.state
        const hasBeenChecked = event.target.checked

        if (!isReadOnly && hasBeenChecked) {
            Rules.methods.enterReadOnly.cacheSend({ from: this.props.drizzleState.accounts[0] });
        } else if (isReadOnly && !hasBeenChecked) {
            Rules.methods.exitReadOnly.cacheSend({ from: this.props.drizzleState.accounts[0] });
        }
      };

    refreshReadOnlyState = () => {
        const Rules = this.props.drizzleState.contracts.Rules;
        var result = Rules.isReadOnly[this.state.isReadOnlyKey];

        if (result && result.value !== this.state.isReadOnly) {
            this.setState({
                isReadOnly: result.value
            })
        }
    }

    render() {
    return (
        <div>
            <FormGroup>
                <FormControlLabel
                    control={
                    <Switch disabled={!this.props.isAdmin} checked={this.state.isReadOnly} onChange={this.handleChange} aria-label="LoginSwitch" />
                    }
                    label={this.state.isReadOnly ? 'Read-Only Enabled' : 'Read-Only Disabled '}
                />
            </FormGroup>
        </div>
    )
    }
}
