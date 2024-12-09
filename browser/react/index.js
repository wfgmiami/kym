import React from 'react';
import ReactDOM from 'react-dom';

import {
  browserHistory,
  IndexRoute,
  Route,
  Router
} from 'react-router';

import store from '../redux/store';
import Home from './Home';
import FoodRecord from './FoodRecord';
import MealPlanner from './MealPlanner';
import ShoppingList from './ShoppingList';
import PublicMeals from './PublicMeals';
import List from './List';
import SetGoals from './SetGoals';
import { Provider } from 'react-redux';
import { exchangeTokenForUser } from '../redux/reducers/root';
import Main from './Main';

const init = () => {
  store.dispatch( exchangeTokenForUser() );
};

// for oauth
if ( document.location.search.indexOf( 'token=' ) === 1 ) {
  const token = document.location.search.slice( 1 ).split( '&' )[ 0 ].split( 'token=' )[ 1 ];
  window.localStorage.setItem( 'token', token );
  browserHistory.push( '/' );
}

const router = (
  <Provider store={ store }>
    <Router history={ browserHistory }>
      <Route path="/" component={ Main } onEnter={ init }>
        <IndexRoute component={ Home } />
        <Route path="/food-record" component={ FoodRecord } />
        <Route path="/meal-planner" component={ MealPlanner } />
        <Route path="/shopping-list" component={ ShoppingList } />
        <Route path="/public-meals" component={ PublicMeals } />
        <Route path="/modify-goals" component={ SetGoals } />
        <Route path="/list" component={ List } />
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render( router, document.getElementById( 'app' ) );

