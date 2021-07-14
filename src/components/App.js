import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import EthSwap from '../abis/EthSwap.json'
import Token from '../abis/Token.json'
import NavBar from './NavBar';
import Main from './Main';


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ethBalance: '0',
      token: {},
      ethSwap: {},
      tokenBalance: '0',
      ethSwapBalance: '0',
      loading: true
    }
  }

  buyTokens = async (etherAmount) => {
    this.setState({ loading: true })
    await this.state.ethSwap.methods
      .buyTokens()
      .send({ from: this.state.account, value: etherAmount })
      .on('transactionHash', (hash)=>{
      
        this.setState({ loading: false })
        //this.loadBlockchainData();
      })

  }


  sellTokens = async (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({from: this.state.account}).on('transactionHash', ()=>{
      this.state.ethSwap.methods
      .sellTokens(tokenAmount)
      .send({ from: this.state.account})
      .on('transactionHash', (hash)=>{
        this.setState({ loading: false })
        //this.loadBlockchainData();
      })
    })
    
  }

  async componentWillMount() {
    await this.loadWeb3();
    // console.log(window.web3);
    await this.loadBlockchainData();
    this.setState({ loading: false })
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // console.log(accounts);
    const ethBalance = await web3.eth.getBalance(accounts[0])
    this.setState({ ethBalance })
    // console.log(ethBalance.toString());

    const networkId = await web3.eth.net.getId()

    // load Token Contract
    const tokenData = Token.networks[networkId];
    // const address = Token.networks[networkId].address
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      // console.log(tokenBalance.toString())
      this.setState({ tokenBalance: tokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed to the detected network')
    }

    // load EthSwap Contract
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ ethSwap })
      // console.log(this.state.ethSwap);
      // let ethSwapBalance = await ethSwap.methods.balanceOf(this.state.account).call()
      // console.log('ethswap ',ethSwapBalance.toString())
      // this.setState({ethSwapBalance: ethSwapBalance.toString()})
    } else {
      window.alert('Token contract not deployed to the detected network')
    }


  }

  async loadWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  render() {
    return (
      <div>
        <NavBar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {
                  this.state.loading === false ?
                    <Main
                      ethBalance={this.state.ethBalance}
                      tokenBalance={this.state.tokenBalance}
                      buyTokens={this.buyTokens}
                      sellTokens={this.sellTokens} />
                    : <p id="loader" className="text-center">loading...</p>
                }
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
