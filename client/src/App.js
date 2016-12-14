import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function List(props) {
  return (
    <ul>
      {props.list.map( (value, index) => {
        return <li key={index} > {value} </li>;
      })}
    </ul>
  ) 
}

class App extends Component {
  render() {
    fetch("/api/locations")
    .then( (response) => {
      console.log(response.json());
    });

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <List list={[1, 2, 3, 4, 5]} />
      </div>
    );
  }
}

export default App;
