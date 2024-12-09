import axios from 'axios';

import { REQUEST_DATA, RECEIVE_USER, RECEIVE_PROGRAMS } from '../constants';

export default (state = {}, action) => {
  let newState;
  switch (action.type) {

    case '':
      break;

    default:
      return state;

  }
  return newState;
};


export const fetchUserInfo = token => dispatch => {
  return axios.get( '/api/user', { params: { token } } )
    .then( ( { data } ) => {
      delete data.password;
      dispatch( { type: RECEIVE_USER, payload: data } );
    } );
};

export const fetchPrograms = token => dispatch => {
  return axios.get( '/api/programs' )
    .then( ( { data } ) => {
      dispatch( { type: RECEIVE_PROGRAMS, payload: data } );
    } );
};
