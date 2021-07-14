import React, { Component } from 'react';
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'
import BuyForm from './BuyForm';
import SellForm from './SellForm';


class Main extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentForm: 'buy'
        }
    }

    render() {
        return (
            <div id="content">
                <div className="d-flex justify-content-between mb-3">
                    <button onClick={ (e)=>this.setState({currentForm: 'buy'}) } className="btn btn-light">
                        Buy
                    </button>
                    <span className="text-muted">&lt; &nbsp; &gt; </span>
                    <button onClick={ (e)=>this.setState({currentForm: 'sell'}) } className="btn btn-light">
                        Sell
                    </button>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        {this.state.currentForm === 'buy' ?
                            <BuyForm {...this.props} /> :
                            <SellForm {...this.props} />}
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
