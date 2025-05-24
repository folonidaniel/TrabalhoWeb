import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElem = document.getElementById('root')
rootElem.style.height = "100%"

const root = ReactDOM.createRoot(rootElem);
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);