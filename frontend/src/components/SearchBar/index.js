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

  noResults() {
    return {
      id: -1,
      name: 'Não foram encontrados resultados.',
      _unclickable: true,
    };
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
          onChange={(e) => this.setTerm(e.target.value)}
          onKeyUp={(e) => {
            if (e.key !== 'Enter') return;
            this.search.call(this, this.state.searchTerm,
                this.context.boundaries);
          }}>
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

  async search(term, boundaries) {
    if (!term || term.trim().length < 2) {
      return this.setState({searchResults: [this.typeSomething()]});
    }

    const shops = await TireRepairShop.findByNameAndCoords({name: term,
      ...boundaries});

    if (shops.length === 0) {
      shops.push(this.noResults());
    }

    this.setState({searchResults: shops});
  }

  setTerm(term) {
    this.setState({
      searchTerm: term,
    });
  }

  typeSomething() {
    return {
      id: -1,
      name: 'Sua busca deve ter no mínimo dois caracteres.',
      _unclickable: true,
    };
  }
}

SearchBar.contextType = AppContext;
