import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function List(props) {
  const { list } = props;
  // console.log(list);
  return (
    <ul>
      {list.map( (value, index) => {
        return <li key={index} > {value} </li>;
      })}
    </ul>
  ) 
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locations: null
    }
  }

  componentDidMount() {
    this.fetchLocations();
  }

  setStateLocations(locations) {
    this.setState({ locations });
  }

  fetchLocations() {
    fetch("/api/locations")
      .then( (response) => {
        return response.json().then( (json) => {
          this.setStateLocations(json);
        });
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        { this.state.locations ? <List list={this.state.locations} /> : null }
      </div>
    );
  }
}

export default App;
