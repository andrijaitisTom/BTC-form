import React from 'react';
import logo from './logo.svg';
import './App.css';

function multiplyAndSplit (currAmount, enteredValue) {
  const result = parseFloat(currAmount.replace(/,/g, ''))*enteredValue
  const finalAmount = result.toFixed(2)
  const stringWithCommas= Number(finalAmount).toLocaleString()
  
 
 return stringWithCommas
 }


class App extends React.Component {

  state = {
    mounting: false,
    currency: null,
    usdSelected: false,
    eurSelected: false,
    gbpSelected: false,
    inputValue: '',
    showSelect : true,
    
  }


  async getPrices(){
    const res = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json", {
      'Content-Type': 'application/json'
    })
    const data = await res.json()
    this.setState({currency: data.bpi, mounting: true})
    console.log('called')
  }
  
_isMounted = false;

componentDidMount() {
  this._isMounted = true;
 this.getPrices()
 setInterval(() => {
   if(this._isMounted === true ){
     this.getPrices()
   }
 }, 60*1000);
}


// componentWill unmount naudoju, kad isvengciau memory leaks
componentWillUnmount() {
this._isMounted = false;
}





usdSelectedHandler = () => {
  let currentState = this.state.usdSelected
  this.setState({usdSelected: !currentState})
}


eurSelectedHandler = () => {
  let currentState = this.state.eurSelected
  this.setState({eurSelected: !currentState})
}


gbpSelectedHandler = () => {
  let currentState = this.state.gbpSelected
  this.setState({gbpSelected: !currentState})
}




inputHandler = (val) => {
  const re = /^(?!0{2,})[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

  if (val === '' || re.test(val)) {
  this.setState({inputValue: val})
}}





render() {



return (
  <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>React form showing current BTC price
        </p>
      </header>
      <div>
        {!this.state.mounting || !this.state.currency ? <div>Please wait ...</div> : 
        <div>
           <div className="priceContainer">
           <h1 className="currentPrice">Current BTC price</h1>
           <input placeholder="0.00 BTC" value={this.state.inputValue} onChange={e => this.inputHandler(e.target.value)} ></input>
{this.state.eurSelected ? <p>{multiplyAndSplit(this.state.currency.EUR.rate, this.state.inputValue)} {this.state.currency.EUR.code} <span><button onClick={this.eurSelectedHandler} className={"cancelOrder"}></button></span></p> : null }
{this.state.usdSelected ? <p>{multiplyAndSplit(this.state.currency.USD.rate, this.state.inputValue)} {this.state.currency.USD.code} <span><button onClick={this.usdSelectedHandler} className={"cancelOrder"}></button></span></p> : null }
{this.state.gbpSelected ?  <p>{multiplyAndSplit(this.state.currency.GBP.rate, this.state.inputValue)} {this.state.currency.GBP.code} <span><button onClick={this.gbpSelectedHandler} className={"cancelOrder"}></button></span></p> : null }

         </div>
         <div className="fiatContainer">
 
         {!this.state.usdSelected || !this.state.gbpSelected || !this.state.eurSelected ? <div className="dropdown">
  <button className="dropbtn">Select your currency</button>
  <div className="dropdown-content">
              {!this.state.usdSelected ? <p onClick={this.usdSelectedHandler}>USD  </p>: null }
              {!this.state.gbpSelected ? <p onClick={this.gbpSelectedHandler}>GBP  </p>: null }
              {!this.state.eurSelected ? <p  onClick={this.eurSelectedHandler}>EUR</p>: null }
  </div>
 </div> : null}
         </div>

         </div>
         }
      </div>
     
    </div>
  );
}
}


export default App;
