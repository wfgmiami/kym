import {
  createStore,
  applyMiddleware
} from 'redux';

import thunkMiddleware from 'redux-thunk';
import { fetchFoodRecord, getCalories } from './reducers/foodrecord';

import reducer from './reducers';

let store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware( thunkMiddleware )
);

let token = localStorage.getItem( 'token' );
if ( token ) {
  store.dispatch( fetchFoodRecord( ( new Date() ).toDateString(), token ) );
  store.dispatch( getCalories() );
}

export default store;

