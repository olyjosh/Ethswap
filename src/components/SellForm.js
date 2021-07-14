import React, { Component } from 'react';
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'


class SellForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            output: '0'
        }
    }

    render() {
        return (
            <form className="mb-3" onSubmit={(e) => {
                e.preventDefault();
                let tokenAmount = this.input.value.toString()
                tokenAmount = window.web3.utils.toWei(tokenAmount, 'Ether');
                this.props.sellTokens(tokenAmount)
                console.log("submitting ");
            }}>


                <div>
                    <label className="float-left"><b>Output</b></label>
                    <span className="float-right text-muted">
                        Balance: {window.web3.utils.fromWei(this.props.tokenBalance)}
                    </span>
                </div>
                <div className="input-group mb-4">
                    <input onChange={(e) => {
                        const tokenAmount = this.input.value.toString();
                        this.setState({ output: tokenAmount / 100 })
                    }}
                        ref={(input) => { this.input = input }}
                        type="number"
                        className="form-control form-control-lg"
                        placeholder="0"
                        required />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <img src={tokenLogo} height='32' alt="" />
                            &nbsp;&nbsp;  DApp
                        </div>
                    </div>
                </div>

                <div>
                    <label className="float-left"><b>Input</b></label>
                    <span className="float-right text-muted">
                        Balance: {window.web3.utils.fromWei(this.props.ethBalance)}
                    </span>
                </div>
                <div className="input-group mb-4">
                    <input value={this.state.output}
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="0"
                        disabled />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <img src={ethLogo} height='32' alt="" />
                            &nbsp;&nbsp;&nbsp; ETH
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <span className="float-left text-muted">Exchange Rate</span>
                    <span className="float-right text-muted">100 ETH = 1 DApp</span>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg"> SWAP </button>
            </form>
        );
    }
}

export default SellForm;