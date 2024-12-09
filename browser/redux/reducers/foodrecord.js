import store from '../store';
import axios from 'axios';
import { ADD_MEAL, CHANGE_DAY, RECEIVE_FOOD_SEARCH_RESULT, REQUEST_DATA, RECEIVE_FOOD_RECORD, REMOVE_FOOD_RECORD_ITEM, UPDATE_RECORD } from '../constants';

const initialState = {
  addMeal: 1,
  foodSearchResults: [],
  calories: 0
};

class FoodRecordCache {
  addRecord( record ) {
    let dateString = new Date( record.Date ).toDateString().slice( 4 );
    if ( this[ dateString ] ) {
      this[ dateString ].push( record );
    } else {
      this[ dateString ] = [ record ];
    }
  }

  removeRecord( recordId, dateObj ) {
    let dateString = dateObj.toDateString().slice( 4 );
    this[ dateString ] = this[ dateString ].filter( food => food.id !== recordId );
  }

  updateRecord( record ) {
    let dateString = new Date( record.Date ).toDateString().slice( 4 );
    this[ dateString ] = this[ dateString ].map( rc => {
      if ( rc.id === record.id ) {
        rc = Object.assign( {}, record );
      }
      return rc;
    } );
  }
}

class CaloriesCache {
  addRecord( record ) {
    this[ record.dateTime ] = record.value * 1;
  }

  bulkAddRecord( records ) {
    records.forEach( record => this.addRecord( record ) );
  }

  hasRecord( dateInp ) {
    const date = this.convertDate( dateInp );
    return date !== this.convertDate( new Date() ) && !isNaN( this[ date ] + 1 ) && !isNaN( this[ dateInp ] + 1 );
  }

  convertDate( dateObj ) {
    if ( !dateObj ) return null;
    if ( typeof dateObj === 'string' && dateObj.split( '-' ).length === 3 ) {
      return dateObj;
    }
    let dt = ( dateObj instanceof Date ) ? dateObj : new Date( dateObj );
    dt = new Date( dt.getTime() );
    dt = dt.toLocaleDateString().split( '/' );
    return `${dt[2]}-${dt[0].length === 1 ? '0' + dt[0] : dt[0]}-${dt[1]}`;
  }
}


export const caloriesCache = new CaloriesCache;
export const foodRecordCache = new FoodRecordCache;

// window.foodRecordCache = foodRecordCache;
// window.caloriesCache = caloriesCache;

export default ( state = initialState, action ) => {
  switch ( action.type ) {

  case ADD_MEAL:
    state = changeState( { addMeal: action.payload } );
    break;

  case RECEIVE_FOOD_SEARCH_RESULT:
    state = changeState( { foodSearchResults: action.payload } );
    break;

  case 'RECEIVE_CALORIES':
    state = changeState( { calories: action.payload } );
    break;

  default:
    break;
  }

  return state;

  function changeState( obj ) {
    return Object.assign( {}, state, obj );
  }
};

export const updateQuantity = ( record, quant ) => dispatch => {
  return axios.put( `/api/food-record/quantity/${record.id}`, quant )
    .then( ( { data } ) => dispatch( { type: 'UPDATE_RECORD_QUANTITY', payload: data } ) );
};

export const fetchFoods = queryString => dispatch => {
  dispatch( { type: REQUEST_DATA } );
  return axios.get( `/api/food/${queryString}` )
    .then( ( { data } ) => {
      dispatch( { type: RECEIVE_FOOD_SEARCH_RESULT, payload: data } );
    } );
};

export const addFoodRecord = ( { abbrev_id, date, meal, quantity, unit, confirmed } ) => dispatch => {

};

const getToken = () => {
  const token = localStorage.getItem( 'token' );
  if ( !token ) {
    throw new Error( 'There is no token' );
  }
  return token;
};

export const handleAddMeal = ( meal, mealId, date ) => dispatch => {


  meal.forEach( factor => {
    factor.foods.forEach( food => {

      const quantities = modWeight( food, factor.weight );

      axios.post( `/api/food-record`, {
          abbrev_id: food.id,
          date: date.toDateString(),
          meal: mealId,
          quantity: quantities[ 0 ],
          unit: food.weights[ 0 ].Seq,
          confirmed: false
        }, { params: { token: getToken() } } )
        .then( ( { data } ) => {
          dispatch( {
            type: RECEIVE_FOOD_RECORD,
            payload: data
          } );
        } );

    } );
  } );
};

function modWeight( food, weight ) {
  return food.weights.map( wt => {
    return Math.round( weight.gr / ( wt.Gr_Wgt * 1 ) * ( wt.Amount * 1 ) * 10 ) / 10;
  } );
}

export const handleAddDay = ( dayMeals, date ) => dispatch => {
  dayMeals.map( ( meal, ix ) => {
    if ( meal ) {
      meal.map( factor => {
        factor.foods.map( ( food ) => {

          const quantities = modWeight( food, factor.weight );
          axios.post( `/api/food-record`, {
              abbrev_id: food.id,
              date: typeof date === 'string' ? date : date.toDateString(),
              meal: ix + 1,
              quantity: quantities[ 0 ],
              unit: food.weights[ 0 ].Seq,
              confirmed: false
            }, { params: { token: getToken() } } )
            .then( ( { data } ) => {
              dispatch( {
                type: RECEIVE_FOOD_RECORD,
                payload: data
              } );
            } );
        } );
      } );
    }
  } );
};

export const handleAddFoodRecord = ( record ) => dispatch => {
  axios.post( `/api/food-record`, record, { params: { token: getToken() } } )
    .then( ( { data } ) => {
      dispatch( {
        type: RECEIVE_FOOD_RECORD,
        payload: data
      } );
    } );
};

export const fetchFoodRecord = ( datestring, token ) => dispatch => {
  if ( datestring === 'Invalid Date' ) return;
  datestring = datestring.slice( 4 );
  if ( !foodRecordCache[ datestring ] ) {
    dispatch( { type: REQUEST_DATA } );
    return axios.get( `/api/food-record/${datestring}`, { params: { token: getToken() } } )
      .then( ( { data } ) => {
        foodRecordCache[ datestring ] = data;
        dispatch( { type: RECEIVE_FOOD_RECORD, payload: data } );
      } );
  } else {
    dispatch( { type: RECEIVE_FOOD_RECORD, payload: foodRecordCache[ datestring ] } );
  }
};

const receiveCalories = ( startDate = new Date() ) => dispatch => dispatch( { type: 'RECEIVE_CALORIES', payload: caloriesCache[ startDate ] } );

export const getCalories = ( startDate, endDate ) => dispatch => {
  if ( !isNaN( caloriesCache[ caloriesCache.convertDate( startDate ) ] + 1 ) ) {
    startDate = caloriesCache.convertDate( startDate );
    dispatch( receiveCalories( startDate ) );
  }
  if ( startDate && caloriesCache.hasRecord( caloriesCache.convertDate( startDate ) ) ) {
    dispatch( receiveCalories( startDate ) );
    return Promise.resolve();
  }

  return axios.get( '/api/fitbit/calories', { params: { token: getToken(), startDate: caloriesCache.convertDate( startDate ), endDate: caloriesCache.convertDate( endDate || startDate ) } } )
    .then( ( { data } ) => {
      caloriesCache.bulkAddRecord( data );
      dispatch( { type: 'RECEIVE_CALORIES', payload: data[ 0 ].value * 1 } );
    } );
};

export const changeDay = dateObj => dispatch => {
  dispatch( { type: CHANGE_DAY, payload: dateObj } );
  dispatch( fetchFoodRecord( dateObj.toDateString() ) );
  dispatch( getCalories( dateObj ) );
};

export const nextDayClick = () => dispatch => {
  let currentDay = store.getState().root.date;
  const nextDay = new Date( currentDay.getTime() + 60 * 60 * 24 * 1000 );
  dispatch( changeDay( nextDay ) );
};

export const previousDayClick = () => dispatch => {
  let currentDay = store.getState().root.date;
  const previousDay = new Date( currentDay.getTime() - 60 * 60 * 24 * 1000 );
  dispatch( changeDay( previousDay ) );
};


export const confirmRecord = id => dispatch => {
  return axios.put( `/api/food-record/${id}/true`, { params: { token: getToken() } } )
    .then( ( { data } ) => dispatch( { type: 'CONFIRM_RECORD', payload: data.id } ) );
};

export const calculateDayMacros = record => {
  record = record.filter( fd => fd.confirmed );
  let calories = Math.round( record.reduce( ( total, food ) => total + food.Calories, 0 ) );
  let protein = Math.round( record.reduce( ( total, food ) => total + food.Protein, 0 ) * 10 ) / 10;
  let carbs = Math.round( record.reduce( ( total, food ) => total + food.Carbohydrates, 0 ) * 10 ) / 10;
  let fat = Math.round( record.reduce( ( total, food ) => total + food.Fat, 0 ) * 10 ) / 10;

  const totalCals = protein * 4 + carbs * 4 + fat * 9;

  return {
    raw: {
      calories,
      protein,
      carbs,
      fat
    },
    percentCals: {
      calories: totalCals,
      protein: Math.round( protein * 4000 / totalCals ) / 10,
      carbs: Math.round( carbs * 4000 / totalCals ) / 10,
      fat: Math.round( fat * 9000 / totalCals ) / 10
    }
  };
};

export const changeAddMeal = mealIdx => dispatch => {
  const meals = [ 'Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Evening Snack' ];
  $( '#myModal' ).modal();
  dispatch( { type: 'ADD_MEAL', payload: { id: mealIdx, name: meals[ mealIdx - 1 ] } } );
};

export const searchFoods = foodquery => dispatch => {
  dispatch( fetchFoods( foodquery ) );
};

export const destroyFoodRecord = id => dispatch => {
  return axios.delete( `/api/food-record`, { data: { id } } )
    .then( () => dispatch( { type: REMOVE_FOOD_RECORD_ITEM, payload: id } ) );
};

export const makeMealPublic = mealId => dispatch => {
  return axios.put( `/api/food-record/meal`, { mealId }, { params: { token: getToken() } } )
    .then( ( { data } ) => dispatch( { type: UPDATE_RECORD, payload: data } ) );
};

