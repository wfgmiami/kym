import axios from 'axios';

import { CHANGE_DAY, CONFIRM_RECORD, CREATE_PROGRAM, LOGIN_SUCCESS, LOGOUT_SUCCESS, INVALID_LOGIN, RECEIVE_FOOD_RECORD, RECEIVE_GOALS, RECEIVE_MEASUREMENTS, RECEIVE_PROGRAMS, RECEIVE_USER, REMOVE_FOOD_RECORD_ITEM, REQUEST_DATA, UPDATE_RECORD } from '../constants';

const initialState = {
  user: {
    username: '',
    mealGoals: []
  },
  date: new Date(),
  foodrecord: [],
  meals: [],
  bmrCalories: ''
};

import { foodRecordCache } from './foodrecord';

export default ( state = initialState, action ) => {
  let newState;
  switch ( action.type ) {

  case REQUEST_DATA:
    newState = changeState( { requestingData: true } );
    break;

  case RECEIVE_USER:
    newState = changeState( { user: action.payload, requestingData: false } );
    break;

  case RECEIVE_PROGRAMS:
    newState = changeState( { programs: action.payload, requestingData: false } );
    break;

  case CHANGE_DAY:
    newState = changeState( { date: action.payload } );
    break;

  case REMOVE_FOOD_RECORD_ITEM:
    newState = changeState();
    foodRecordCache.removeRecord( action.payload, state.date );
    newState.foodrecord = newState.foodrecord.filter( food => food.id !== action.payload );
    break;

  case RECEIVE_FOOD_RECORD:
    if ( Array.isArray( action.payload ) ) { // records for an entire day
      newState = changeState( { foodrecord: action.payload, requestingData: false } );
      foodRecordCache[ state.date.toDateString().slice( 4 ) ] = newState.foodrecord.slice();
    } else { // single item
      newState = changeState();
      newState.foodrecord = state.foodrecord.slice();
      if ( new Date( action.payload.Date ).toDateString() === newState.date.toDateString() ) {
        newState.foodrecord.push( action.payload );
      }
      foodRecordCache.addRecord( action.payload );
    }
    break;

  case UPDATE_RECORD:
    newState = changeState();
    newState.foodrecord = newState.foodrecord.map( food => {
      if ( food.meal.id === action.payload.id ) {
        food.meal = action.payload;
      }
      return food;
    } );
    break;

  case 'UPDATE_RECORD_QUANTITY':
    newState = changeState();
    newState.foodrecord = newState.foodrecord.map( food => {
      if ( food.id === action.payload.id ) {
        food = action.payload;
      }
      return food;
    } );
    foodRecordCache.updateRecord( action.payload );
    break;

  case CONFIRM_RECORD:
    newState = changeState();
    newState.foodrecord = state.foodrecord.slice().map( fd => {
      if ( fd.id === action.payload ) {
        fd.confirmed = true;
      }
      return fd;
    } );
    foodRecordCache[ state.date.toDateString().slice( 4 ) ] = newState.foodrecord.slice();
    break;

  case CREATE_PROGRAM:
    newState = changeState();
    newState.user.programs = state.user.programs.slice();
    newState.user.programs.push( action.payload );
    break;

  case LOGIN_SUCCESS:
    newState = changeState( { user: action.user, invalidLogin: false } );
    break;

  case LOGOUT_SUCCESS:
    newState = changeState( { user: '' } );
    break;

  case INVALID_LOGIN:
    newState = changeState( { invalidLogin: true } );
    break;

  case RECEIVE_MEASUREMENTS:
    newState = changeState();
    newState.user = Object.assign( {}, state.user );
    newState.user.userMeasurements = state.user.userMeasurements.slice();
    newState.user.userMeasurements.push( action.payload );
    break;

  case RECEIVE_GOALS:
    newState = changeState();
    newState.user.mealGoals = state.user.mealGoals.slice();
    newState.user.mealGoals.push( action.payload );
    break;

  case 'DESTROY_MEASUREMENT':
    newState = changeState();
    newState.user = Object.assign( {}, state.user );
    newState.user.userMeasurements = newState.user.userMeasurements.filter( meas => meas.id !== action.payload );
    break;

  case 'SAVE_BMR_CALORIES':
    newState = changeState();
    newState.bmrCalories = action.payload;
    break;

  default:
    return state;

  }
  return newState;

  function changeState( obj ) {
    return Object.assign( {}, state, obj || null );
  }
};

export const createUser = userProps => dispatch => {
  return axios.post( '/api/user', userProps )
    .then( ( { data } ) => {
      // Sign in the new user and take them to the homepage
      localStorage.setItem( 'token', data.token );
    } );
};

const loginSuccess = ( user ) => ( { type: LOGIN_SUCCESS, user } );
const logoutSuccess = () => ( { type: LOGOUT_SUCCESS } );
const loginFail = () => ( { type: INVALID_LOGIN } );
const invalidLogin = () => dispatch => dispatch( loginFail() );

export const logout = () => dispatch => {
  localStorage.removeItem( 'token' );
  dispatch( logoutSuccess() );
  return Promise.resolve();
};

export const getToken = () => {
  const token = localStorage.getItem( 'token' );
  if ( !token ) {
    throw new Error( 'There is no token' );
  }
  return token;
};

export const exchangeTokenForUser = () => dispatch => {
  if ( !localStorage.getItem( 'token' ) ) {
    return console.warn( 'No local storage token' );
  }
  return axios.get( `/api/session/${localStorage.getItem('token')}` )
    .then( ( { data } ) => {
      dispatch( loginSuccess( data ) );
      return data;
    } );
};

export const destroyMeasurement = measId => dispatch => {
  return axios.delete( '/api/user/measurements', { params: { token: getToken() }, data: { id: measId } } )
    .then( () => dispatch( { type: 'DESTROY_MEASUREMENT', payload: measId } ) );
};

export const login = credentials => dispatch => {
  return axios.post( 'api/session', credentials )
    .then( response => response.data )
    .then( ( { token } ) => localStorage.setItem( 'token', token ) )
    .then( () => dispatch( exchangeTokenForUser() ) )
    .catch( ( er ) => {
      localStorage.removeItem( 'token' );
      dispatch( invalidLogin( loginFail() ) );
    } );
};

export const createProgram = measurements => dispatch => {
  console.log( 'createProgram' );
  return axios.post( 'api/programs', measurements, { params: { token: getToken() } } )
    .then( ( { data } ) => dispatch( { type: CREATE_PROGRAM, payload: data } ) );
};

export const saveMeasurements = ( measurements, user ) => dispatch => {
  let _data;
  return axios.post( '/api/user/measurements', measurements, { params: { token: getToken() } } )
    .then( ( { data } ) => {
      _data = data;
      if ( !user.programs ) {
        return dispatch( createProgram( measurements ) );
      } else if ( !user.programs[ 0 ] ) {
        return dispatch( createProgram( measurements ) );
      } else if ( user.programs[ 0 ].status !== 'In Progress' ) {
        return dispatch( createProgram( measurements ) );
      }
    } )
    .then( () => dispatch( { type: RECEIVE_MEASUREMENTS, payload: _data } ) );
};

export const updateWeight = ( _measurements, newWeight, user, date ) => dispatch => {
  const measurements = Object.assign( {}, _measurements );
  measurements.weight = newWeight;
  delete measurements.id;
  measurements.createdAt = date;
  measurements.updatedAt = date;
  return dispatch( saveMeasurements( measurements, user ) );
};

export const bmrCalories = calories => dispatch => dispatch( { type: 'SAVE_BMR_CALORIES', payload: calories } );

export const saveGoals = ( { trainingGoals, restingGoals } ) => dispatch => {

  trainingGoals = trainingGoals.reduce( ( memo, meal ) => {
    memo[ meal.id ] = { protein: meal.pGoal, carbs: meal.cGoal, fat: meal.fGoal };
    return memo;
  }, {} );

  restingGoals = restingGoals.reduce( ( memo, meal ) => {
    memo[ meal.id ] = { protein: meal.pGoal, carbs: meal.cGoal, fat: meal.fGoal };
    return memo;
  }, {} );

  for ( let i = 0; i < 6; i++ ) {
    if ( !trainingGoals[ i ] ) {
      trainingGoals[ i ] = { protein: 0, carbs: 0, fat: 0 };
    }
    if ( !restingGoals[ i ] ) {
      restingGoals[ i ] = { protein: 0, carbs: 0, fat: 0 };
    }
  }

  trainingGoals = Object.values( trainingGoals );
  restingGoals = Object.values( restingGoals );

  return axios.post( '/api/goals/meals', { train: trainingGoals, rest: restingGoals }, { params: { token: getToken() } } )
    .then( ( { data } ) => dispatch( { type: RECEIVE_GOALS, payload: data } ) );

};

