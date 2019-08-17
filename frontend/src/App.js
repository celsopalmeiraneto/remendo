import React, {Component} from 'react';

import {AppContext} from './app-context.js';
import {Map} from './components/Map';
import {SearchBar} from './components/SearchBar';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.setBoundaries = (bounds) => this.setState({boundaries: bounds});
    this.setHighlightedShop = (shop) => {
      this.setState({highlightedShop: shop});
    };
    this.setZoom = (zoom) => this.setState({zoom: zoom});

    this.state = {
      zoom: null,
      highlightedShop: null,
      boundaries: null,
      setZoom: this.setZoom,
      setHighlightedShop: this.setHighlightedShop,
      setBoundaries: this.setBoundaries,
      setCentroidTo: () => {},
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
