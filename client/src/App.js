import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function getWeather() {
  const url = 'http://opendata.cwb.gov.tw/opendataapi?dataid=F-C0032-002&authorizationkey=CWB-CD4F5BAD-7054-48A1-BF5E-5B0B94F87385';
  var headers = new Headers();
  headers.append('Access-Control-Allow-Origin', '*');;
  headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.append('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  var init = { 
    method: 'GET',
    headers: headers, 
    mode: 'no-cors'};

  var request = new Request(url, init);

  fetch(request).then( (response) => {
    console.log(response);
  }).catch( (err) => {
    console.log(err);
  })

  fetch(request).then( (response) => {
    console.log(response);
  }).catch( (err) => {
    console.log(err);
  })
}

getWeather();

class App extends Component {
  render() {
    
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
