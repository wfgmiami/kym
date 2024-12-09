import axios from 'axios';

import {
  CALCULATE_MEAL_SUCCESS,
  CALCULATE_MEAL_ERROR,
  GENERATE_FOOD_SUCCESS,
  GENERATE_FOOD_ERROR
} from '../constants';
import filteredMeals from '../../../filteredmeals.json';


const initialState = {
  generatedFoods: [],
  meal: [],
  error: null
};

export default ( state = initialState, action ) => {
  switch ( action.type ) {

  case GENERATE_FOOD_SUCCESS:
    state = Object.assign( {}, state, { generatedFoods: state.generatedFoods } );
    state.generatedFoods.push( action.payload );

    if ( state.generatedFoods.length > 4 ) {
      state = Object.assign( {}, state, { generatedFoods: state.generatedFoods.slice( 1 ) } );
    }
    break;
  case GENERATE_FOOD_ERROR:
    state = Object.assign( {}, state );
    state.error = action.payload;
    break;
  case CALCULATE_MEAL_SUCCESS:
    state = Object.assign( {}, state, action.payload );
    if ( state.error ) delete state.error;

    break;
  case CALCULATE_MEAL_ERROR:
    state = Object.assign( {}, state );
    state.error = action.payload;
    console.log('...',state)
    break;
  default:
    break;
  }
  return state;
};

export const calculateFood = params => dispatch => {
  return axios.get( `/api/generate/calculate/`, { params } )
    .then( ( { data } ) => {
      return dispatch( { type: CALCULATE_MEAL_SUCCESS, payload: { meal: data } } );
    } );

};

export const generateFood = params => dispatch => {
  return axios.get( `api/generate/`, { params } )
    .then( ( { data } ) => {
      if ( data.error ) {
        return dispatch( { type: GENERATE_FOOD_ERROR, payload: data.error } );
      }
      return dispatch( { type: GENERATE_FOOD_SUCCESS, payload: { generatedFoods: data } } );
    } );
};


