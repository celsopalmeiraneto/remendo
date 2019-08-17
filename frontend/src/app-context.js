import React from 'react';

export const AppContext = React.createContext({
  boundaries: null,
  highlightedShop: null,
  zoom: null,
  setCentroidTo: () => {},
  setZoom: () => {},
  setHighlightedShop: () => {},
  setBoundaries: () => {},
});
