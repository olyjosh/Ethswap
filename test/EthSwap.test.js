const { assert } = require('chai')
const { default: Web3 } = require('web3')

const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai').use(require('chai-as-promised')).should()

function tokens(n){
    return web3.utils.toWei(n, 'ether');
}

// contract('EthSwap', (account)=>{
contract('EthSwap', ([deployer, investor])=>{
    let token;
    let ethSwap; 
    before(async()=>{
        token =await Token.new()
        ethSwap =await EthSwap.new(token.address) 
    })

    describe('Token deployment', async ()=>{
        it('contract has name', async()=>{
            const name = await token.name();
            assert(name === 'DApp Token')
        })
        
    })

    describe('EthSwap deployment', async ()=>{
        it('contract has name', async()=>{
            const name = await ethSwap.name();
            assert.equal(name , 'Crypto instant Xchange')
        })

        it('contract has tokens', async()=>{
            await token.transfer(ethSwap.address, tokens('1000000'))
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('buyTokens()', async ()=>{
        let result;

        before(async()=>{
            result = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1', 'ether')})
        })

        it('Allow user to instantly purchase tokens from ethSwap for a fixed price', async()=>{
            // checking invesgtor balance after purchase
            let investorBalance =  await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            // checking ethSwap balance after purchase 
            let ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'))
            // console.log(result.logs);
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })

    })


    describe('sellTokens()', async ()=>{
        let result;

        before(async()=>{
            // approve tokens
            await token.approve(ethSwap.address, tokens('100'), {from: investor})
            // sell the actual token
            result = await ethSwap.sellTokens(100, { from: investor})
        })

        it('Allow user to instantly sell tokens to ethSwap for a fixed price', async()=>{
            // checking invesgtor balance after purchase
            // let investorBalance =  await token.balanceOf(investor)
            // assert.equal(investorBalance.toString(), tokens('100'))

            // // checking ethSwap balance after purchase 
            // let ethSwapBalance = await token.balanceOf(ethSwap.address)
            // assert.equal(ethSwapBalance.toString(), tokens('999900'))
            // ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            // assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'))
            // // console.log(result.logs);
            // const event = result.logs[0].args
            // assert.equal(event.account, investor)
            // assert.equal(event.token, token.address)
            // assert.equal(event.amount.toString(), tokens('100').toString())
            // assert.equal(event.rate.toString(), '100')
        })

    })

})