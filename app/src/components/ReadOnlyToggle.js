import React, { Component } from 'react'
import { FormControlLabel, FormGroup, Switch, Typography } from '@material-ui/core/';

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
            Rules.methods.enterReadOnly.cacheSend();
        } else if (isReadOnly && !hasBeenChecked) {
            Rules.methods.exitReadOnly.cacheSend();
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
            <Typography variant="h6" color="inherit">
                Read-only mode
                </Typography>
                <FormGroup>
                    <FormControlLabel
                        control={
                        <Switch checked={this.state.isReadOnly} onChange={this.handleChange} aria-label="LoginSwitch" />
                        }
                        label={this.state.isReadOnly ? 'Enabled' : 'Disabled '}
                    />
                    </FormGroup>
        </div>
    )
    }
}
