import React from 'react';

export const AppContext = React.createContext({
  boundaries: null,
  zoom: null,
  setZoom: () => {},
  setBoundaries: () => {},
});
