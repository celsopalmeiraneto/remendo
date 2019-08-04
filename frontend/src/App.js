import React, {Component} from 'react';

import {AppContext} from './app-context.js';
import {Map} from './components/Map';
import {SearchBar} from './components/SearchBar';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.setZoom = (zoom) => this.setState({zoom: zoom});
    this.setBoundaries = (bounds) => this.setState({boundaries: bounds});

    this.state = {
      zoom: null,
      boundaries: null,
      setZoom: this.setZoom,
      setBoundaries: this.setBoundaries,
    };
  }
  render() {
    return (
      <AppContext.Provider value={this.state}>
        <div className="App">
          <main>
            <div className="map">
              <Map />
            </div>
            <div className="search">
              <SearchBar />
            </div>
          </main>
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;
