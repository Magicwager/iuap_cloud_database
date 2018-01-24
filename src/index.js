import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, Link, IndexRoute, hashHistory} from 'react-router';

import App from './containers/App';

import Currency from './containers/currency/Currency';
//import Custom from './containers/custom/Custom';
//import CustomList from './containers/custom/CustomList';
//import Manage from './containers/manage/Manage';


ReactDom.render(
    <Router onUpdate={() => window.scrollTo(0, 0)} history={hashHistory}>
      <Route path="/" component={App}>
        {/*<Route path="/currency" component={Currency} />
         <Route path="/custom" component={Custom} />
         <Route path="/customlist/:id" component={ CustomList} />
        <Route path="/manage" component={ Manage } />*/}
        <IndexRoute component={ Currency } />
      </Route>
    </Router>,
    document.getElementById('root')
);
