import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';
import 'react-select/dist/react-select.css';

const DEFAULT_LOCATION = "taipei-city";

// function List(props) {
//   const { list } = props;
//   // console.log(list);
//   return (
//     <ul className="table">
//       {list.map( (value, index) => {
//         return <li key={index} className="table-row"> {value} </li>;
//       })}
//     </ul>
//   ) 
// }

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locations: null,
      selectedLocation: DEFAULT_LOCATION,
      selectedLocation36Forecast: {},
    };

    this.handleSelectCityChange = this.handleSelectCityChange.bind(this);
    this.generateOptionsFromLocations = this.generateOptionsFromLocations.bind(this);
    this.setStateLocations = this.setStateLocations.bind(this);
    this.setStateSelectedLocation = this.setStateSelectedLocation.bind(this);
    this.setStateSelectedLocation36Forecast = this.setStateSelectedLocation36Forecast.bind(this);

  }

  handleSelectCityChange(thing) {
    console.log(`Selected new city ${thing.value}`);
    this.setStateSelectedLocation(thing.value);
    this.fetchThirtySix(this.state.selectedLocation);
  }

  generateOptionsFromLocations(locations) {
    let options = locations.map((location) => {
      return { value: location.toLowerCase().split(' ').join('-'), label: location.toLowerCase()}
    });
    return options;
  }

  componentDidMount() {
    this.fetchLocations();
    this.fetchThirtySix(this.state.selectedLocation);
  }

  setStateLocations(locations) {
    this.setState({ locations });
  }

  setStateSelectedLocation(selectedLocation) {
    this.setState({ selectedLocation });
  }

  setStateSelectedLocation36Forecast(selectedLocation36Forecast) {
    this.setState({ selectedLocation36Forecast });
  }

  fetchLocations() {
    console.log("Fetching locations");
    fetch("/api/locations")
      .then( (response) => {
        return response.json().then( (json) => {
          this.setStateLocations(json);
        });
      });
  }

  fetchThirtySix(location) {
    console.log("Fetching 36");
    fetch(`/api/${location}/thirtysix`)
      .then( (response) => {
        return response.json().then( (json) => {
          console.log(json);
          this.setStateSelectedLocation36Forecast(json);
        });
      });
  }

  render() {
    if (this.state.selectedLocation36Forecast === {}) {
      this.fetchThirtySix(this.state.selectedLocation);
    }
    return (
      <div className="App">
        <Select
          name="cities"
          value={this.state.selectedLocation}
          placeholder="Select location"
          options={this.generateOptionsFromLocations(this.state.locations ? this.state.locations : [])}
          onChange={this.handleSelectCityChange}
        />
      </div>
    );
  }
}

export default App;
