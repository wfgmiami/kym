import axios from 'axios';
import {
  ADD_DAY
} from '../constants';
import { getToken } from './root';

const initialState = {
  shoppinglist: [],
  fetchingData: false,
  list: []
};

export default ( state = initialState, action ) => {
  switch ( action.type ) {

  case ADD_DAY:
    state = Object.assign( {}, state );
    state.fetchingData = false;
    state.shoppinglist = state.shoppinglist.slice( 0 );
    state.shoppinglist.push( action.payload );
    break;

  case 'FETCHING_DAY_MEAL_PLAN':
    state = Object.assign( {}, state );
    state.fetchingData = true;
    break;

  case 'REMOVE_DAY':
    state = Object.assign( {}, state );
    state.shoppinglist = state.shoppinglist.slice();
    state.shoppinglist.splice( action.payload, 1 );
    break;

  case 'RECALCULATE_DAY':
    state = Object.assign( {}, state );
    state.shoppinglist = state.shoppinglist.slice();
    state.shoppinglist[ action.payload.index ] = action.payload.day;
    state.fetchingData = false;
    break;

  case 'RECEIVE_LIST_ITEMS':
    state = Object.assign( {}, state );
    state.list = action.payload;
    break;

  default:
    break;
  }

  return state;

};

export const addDay = type => dispatch => {
  dispatch( { type: 'FETCHING_DAY_MEAL_PLAN', payload: true } );
  return axios.get( '/api/calculate/day', { params: { token: getToken(), type } } )
    .then( ( { data } ) => {
      return dispatch( { type: ADD_DAY, payload: data } );
    } );
};

export const recalculateDay = ( index, type ) => dispatch => {
  dispatch( { type: 'FETCHING_DAY_MEAL_PLAN', payload: true } );
  return axios.get( '/api/calculate/day', { params: { token: getToken(), type } } )
    .then( ( { data } ) => {
      return dispatch( { type: 'RECALCULATE_DAY', payload: { index, day: data } } );
    } );
};

export const getList = date => dispatch => {
  return axios.get( '/api/shopping-list/list', { params: { token: getToken(), date } } )
    .then( ( { data } ) => dispatch( { type: 'RECEIVE_LIST_ITEMS', payload: data } ) );
};

export const removeDay = index => dispatch => {
  return dispatch( { type: 'REMOVE_DAY', payload: index } );
};

