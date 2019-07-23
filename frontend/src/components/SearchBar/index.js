import React, {Component} from 'react';
import './index.css';

export class SearchBar extends Component {
  render() {
    return (
      <div className="search-bar">
        <input type="text" placeholder="Procura"></input>
        <button><span role="img" aria-label="Bscar">🔎</span></button>
      </div>
    );
  }
}
