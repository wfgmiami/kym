import axios from 'axios';

import {
  LOAD_SEARCHED_FOODS,
  RETAIN_FOOD,
  REMOVE_FOOD,
  CALCULATE_MEAL_SUCCESS,
  CALCULATE_MEAL_ERROR,
} from '../constants';

const initialState = {
  searchedFoods: [],
  retainedFoods: [],
  meal: [],
  error: null
};

export default ( state = initialState, action ) => {
  switch ( action.type ) {

  case LOAD_SEARCHED_FOODS:
    state = Object.assign( {}, state, action.payload );
    break;

  case RETAIN_FOOD:
    state = Object.assign( {}, state, { retainedFoods: state.retainedFoods.slice() } );
    state.searchedFoods = state.searchedFoods.filter( fd => fd.id !== action.payload.id );
    state.retainedFoods.push( action.payload );
    break;

  case REMOVE_FOOD:
    state = Object.assign( {}, state, { retainedFoods: state.retainedFoods.slice() } );
    state.searchedFoods.splice( 0, 0, state.retainedFoods.filter( fd => fd.id === action.payload )[ 0 ] );
    state.retainedFoods = state.retainedFoods.filter( fd => fd.id !== action.payload );
    break;

  case CALCULATE_MEAL_SUCCESS:
    state = Object.assign( {}, state, action.payload );
    if ( state.error ) delete state.error;
    break;

  case CALCULATE_MEAL_ERROR:
    state = Object.assign( {}, state );
    state.error = action.payload;
    state.meal = [];
    break;

  default:
    break;
  }
  return state;
};

export const searchFood = searchTerm => dispatch => {
  if ( !searchTerm ) return;
  return axios.get( `/api/food/${searchTerm}` )
    .then( ( { data } ) => dispatch( { type: 'LOAD_SEARCHED_FOODS', payload: { searchedFoods: data } } ) );
};

export const retainFood = food => dispatch => {
  dispatch( { type: RETAIN_FOOD, payload: food } );
  return Promise.resolve();
};
export const removeFood = id => dispatch => dispatch( { type: REMOVE_FOOD, payload: id } );

export const calculateFood = params => dispatch => {
  return axios.get( `/api/calculate/`, { params } )
    .then( ( { data } ) => {
      if ( data.error ) {
        return Promise.reject( data.error );
      }
      dispatch( { type: CALCULATE_MEAL_SUCCESS, payload: { meal: data } } );
      return Promise.resolve();
    } );
};

export const checkPossibility = ( { foods, goals } ) => dispatch => {
  if ( foods.length < 3 ) return;
  let factors = getFactors( foods );

  // Check for obvious failures
  let { proteinGoal, carbGoal, fatGoal } = goals;
  let check1 = proteinGoal / ( factors.pFood.p * factors.pFood.weight / 100 );
  if ( factors.pFood.c * check1 > carbGoal ) {
    return Promise.reject( 'Add more carbs to the goal' );
  }
  if ( factors.pFood.f * check1 > fatGoal ) {
    return Promise.reject( 'Add more fat to the goal' );
  }

  let check2 = carbGoal / ( factors.cFood.c * factors.cFood.weight / 100 );
  if ( factors.cFood.p * check2 > proteinGoal ) {
    return Promise.reject( 'Add more protein to the goal' );
  }
  if ( factors.cFood.f * check2 > fatGoal ) {
    return Promise.reject( 'Add more fat to the goal' );
  }

  let check3 = fatGoal / ( factors.fFood.f * factors.fFood.weight / 100 );
  if ( factors.fFood.p * check3 > proteinGoal ) {
    return Promise.reject( 'Add more protein to the goal' );
  }
  if ( factors.fFood.c * check3 > carbGoal ) {
    return Promise.reject( 'Add more carbs to the goal' );
  }

  return Promise.resolve();
};

function getFactors( foods ) {
  let fc = foods.reduce( ( memo, food ) => {
    memo[ food.maxMacro ].push( food );
    return memo;
  }, { Protein: [], Carbohydrates: [], Fat: [] } );

  let fct = { pFood: reduceFoods( fc.Protein ), cFood: reduceFoods( fc.Carbohydrates ), fFood: reduceFoods( fc.Fat ) };

  ensureBalance( 'fFood', 'Fat', () => Object.assign( fct, { pFood: reduceFoods( fc.Protein ), cFood: reduceFoods( fc.Carbohydrates ) } ) );
  ensureBalance( 'pFood', 'Protein', () => Object.assign( fct, { cFood: reduceFoods( fc.Carbohydrates ) } ) );
  ensureBalance( 'cFood', 'Carbohydrates' );

  function ensureBalance( type, macro, cb ) {
    if ( fct[ type ].weight === 0 ) {
      fct[ type ].foods = foods.reduce( ( memo, fd ) => {
        if ( fd[ macro ] * 1 > memo[ macro ] ) {
          memo = fd;
        }
        return memo;
      }, { Fat: 0 } );
      fct[ type ].foods = [ fct[ type ].foods ];
      fct[ type ].weight = 100;
      fct[ type ].p = fct[ type ].foods[ 0 ].Protein * 1;
      fct[ type ].c = fct[ type ].foods[ 0 ].Carbohydrates * 1;
      fct[ type ].f = fct[ type ].foods[ 0 ][ macro ] * 1;
      foods = foods.slice( 0 ).filter( fd => {
        return fd.id !== fct[ type ].foods[ 0 ].id;
      } );
    }

    fc = foods.reduce( ( memo, food ) => {
      memo[ food.maxMacro ].push( food );
      return memo;
    }, { Protein: [], Carbohydrates: [], Fat: [] } );
    if ( cb ) cb();
  }
  return fct;

  function reduceFoods( foodArr ) {
    return foodArr.reduce( ( memo, food ) => {
      memo.p += food.Protein * 1;
      memo.c += food.Carbohydrates * 1;
      memo.f += food.Fat * 1;
      memo.weight += 100;
      memo.foods.push( food );
      return memo;
    }, { p: 0, c: 0, f: 0, weight: 0, foods: [] } );
  }
}

