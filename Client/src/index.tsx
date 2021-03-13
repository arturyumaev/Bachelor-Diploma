import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

require('./index.scss');
require('antd/dist/antd.css');

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
