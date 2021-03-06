import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css"
import "@blueprintjs/table/lib/css/table.css"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css"
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  
    <App />
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
