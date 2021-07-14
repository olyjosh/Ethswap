pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = "Crypto instant Xchange";
    Token public token;
    uint256 public rate = 100;

    event TokenPurchased(
        address account, 
        address token, 
        uint amount, 
        uint rate
    );
    
    event TokenSold(
        address account, 
        address token, 
        uint amount, 
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // Redemption rate = No of token they receive for 1 ether
        // Amount of ethereum * Redemption rate
        uint256 tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount );
        token.transfer(msg.sender, tokenAmount);
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }


    function sellTokens(uint _amount) public {

        // user can't sell more token than they have 
        require(token.balanceOf(msg.sender)>= _amount);

        // calculate the amount of Ether to redeem
        uint256 etherAmount = _amount / rate;

        // Require that EthSwap has enough Ether
        require(address(this).balance >= etherAmount);

        // require(token.balanceOf(address(this)) >= etherAmount );
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        emit TokenSold(msg.sender, address(token), _amount, rate);
    }
}
