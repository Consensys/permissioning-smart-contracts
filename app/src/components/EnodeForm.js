import React, { Component } from 'react'

import { enodeToParams } from "../util/enodetools"

export default class EnodeForm extends Component {
  state = {
    enode: '',
    enodeHigh: '',
    enodeLow: '',
    ip: '',
    port: 0,
  }

  componentDidMount() {
    const { drizzle } = this.props;
    const Rules = drizzle.contracts.Rules;

    this.setState({
        rulesCountKey: Rules.methods.getKeyCount.cacheCall()
    })
 }

  handleChange = (e) => {
    this.setState({enode: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const Rules = this.props.drizzle.contracts.Rules;
    let params = enodeToParams(this.state.enode)
    Rules.methods.addEnode.cacheSend(params[0], params[1], params[2], params[3]);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
                    <label>
                    Enode URL:
                    <input type="text" value={this.state.enode} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
      </div>
    )
  }
}
