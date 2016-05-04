require('./main.css');

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import NewItem from './components/NewItem.jsx';

import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/">
      <IndexRoute component={NewItem} />
      <Route path="list" component={App}/>
    </Route>
  </Router>
), document.getElementById('app'));