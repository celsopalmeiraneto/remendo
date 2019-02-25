import React, {Component} from 'react';

import {Map} from './components/Map';
import {SearchBar} from './components/SearchBar';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <main>
          <div className="search">
            <SearchBar />
          </div>
          <div className="map">
            <Map />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
