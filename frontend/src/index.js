import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

(function() {
  const API_KEY = process.env.REACT_APP_GMAPS_API_KEY;
  const gmapsScript = document.createElement('script');
  gmapsScript.async = true;
  gmapsScript.defer = true;
  gmapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  document.body.append(gmapsScript);
})();


ReactDOM.render(<App />, document.getElementById('root'));
