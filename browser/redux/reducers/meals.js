import { getToken } from './index';
import axios from 'axios';

const initialState = {
  meals: []
};

export default ( state = initialState, action ) => {
  switch ( action.type ) {
  case 'RECEIVE_MEALS':
    state = Object.assign({}, state);
    state.meals = action.payload;
    break;
  default:
    break;
  }
  return state;
};

export const getMeals = ({ keyword, meals, postWorkout }) => dispatch => {
  return axios.get( '/api/meal', { params: { token: getToken(), keyword, meals, postWorkout } } )
    .then( ( { data } ) => dispatch( { type: 'RECEIVE_MEALS', payload: data } ) );
};

