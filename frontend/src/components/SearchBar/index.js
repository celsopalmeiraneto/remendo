import React, {Component} from 'react';

import styles from './index.module.css';
import {AppContext} from '../../app-context.js';
import {SearchResults} from '../SearchResults';
import {TireRepairShop} from '../../model/TireRepairShop.js';

export class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.count = 0;
    this.state = {
      searchResults: null,
      searchTerm: '',
    };
  }

  async search(term, boundaries) {
    const shops = await TireRepairShop.findByNameAndCoords({name: term,
      ...boundaries});
    this.setState({searchResults: shops});
  }

  setTerm(term) {
    this.setState({
      searchTerm: term,
    });
  }

  render() {
    return (
      <div className={styles.searchBar}>
        <div className={styles.searchBarResults}>
          {this.state.searchResults &&
            <SearchResults items={this.state.searchResults}></SearchResults>}
        </div>
        <input type="text" placeholder="Encontre uma Borracharia"
          value={this.state.searchTerm}
          onChange={(e) => this.setTerm(e.target.value)}>
        </input>
        <button onClick={(e) => {
          this.search.call(this, this.state.searchTerm,
              this.context.boundaries);
        }}>
          <span role="img" aria-label="Buscar">🔎</span>
        </button>
      </div>
    );
  }
}

SearchBar.contextType = AppContext;
