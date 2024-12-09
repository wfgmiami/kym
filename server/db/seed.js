const db = require( './index' );
const chalk = require( 'chalk' );

console.log( chalk.yellow.inverse.bold( ' Begin Database seed ' ) );
console.log( '---------------------' );
console.log( chalk.magenta(' - Formatting records/meals') );
const record = assignMeal( require( './data/food-record' ) );
console.log( chalk.blue.bold(' -> Records/Meals formatted') );
console.log('---------------------------');

db.sequelize.sync( { force: true } )
  .then( () => {
    seeding( 'Abbrev' );
    return db.Abbrev.bulkCreate( require( './data/abbrev-sep' ) );
  } )
  .then( () => {
    seedInfo( 'Abbrev', 'AbbrevMicro' );
    return db.AbbrevMicro.bulkCreate( require( './data/abbrev-micro' ) );
  } )
  .then( () => {
    seedInfo( 'AbbrevMicro', 'FoodGroup' );
    return db.FoodGroup.bulkCreate( require( './data/fd-group' ) );
  } )
  .then( () => {
    seedInfo( 'FoodGroup', 'FoodDesc' );
    return db.FoodDesc.bulkCreate( require( './data/food-des' ) );
  } )
  .then( () => {
    seedInfo( 'FoodDesc', 'Weight' );
    return db.Weight.bulkCreate( require( './data/weight' ) );
  } )
  .then( () => {
    seedInfo( 'Weight', 'User' );
    return db.User.bulkCreate( require( './data/contact' ) );
  } )
  .then( () => {
    seedInfo( 'User', 'Meals' );
    return db.Meal.bulkCreate( record.mealsArr );
  } )
  .then( () => {
    seedInfo( 'Meals', 'UserMeasurement' );
    return db.FoodRecord.bulkCreate( record.records );
  } )
  .then( () => {
    seedInfo( 'UserMeasurement', 'FoodRecord' );
    return db.UserMeasurement.bulkCreate( require( './data/contact-measurements' ) );
  } )
  .then( () => {
    seedInfo( 'FoodRecord', 'MealGoals' );
    return db.MealGoals.bulkCreate( require( './data/meal-goals' ) );
  } )
  // .then( () => {
  //   return db.Meal.update( { postWorkout: true }, { where: { meal: 4 } } );
  // } )
  .then( () => {
    seeded( 'MealGoals' );
    console.log( chalk.green.inverse.bold( ' Seeded OK ' ) );
    process.exit();
  } )
  .catch( er => console.log( er.stack ) );


function seedInfo( justseeded, nexttoseed ) {
  seeded( justseeded );
  seeding( nexttoseed );
}

function seeded( nexttoseed ) {
  let msg = ` -> ${nexttoseed} seeded`;
  console.log( chalk.blue.bold( msg ) );
  console.log( msg.replace( /./g, '-' ) );
}

function seeding( seed ) {
  console.log( chalk.magenta( ` - Seeding ${seed}` ) );
}

function assignMeal( records ) {
  var mealsObj = records.reduce( ( memo, record ) => {
    if ( !memo[ record.Date ] ) {
      memo[ record.Date ] = {};
    }
    if ( !memo[ record.Date ][ record.Meal ] ) {
      memo[ record.Date ][ record.Meal ] = [];
    }

    memo[ record.Date ][ record.Meal ].push( record.ID );
    return memo;
  }, {} );

  var mealsArr = [];
  Object.keys( mealsObj ).forEach( date => {
    Object.keys( mealsObj[ date ] ).forEach( ( mealIndex, ix ) => {
      mealsArr.push( {
        date: new Date( date ).toDateString(),
        meal: mealIndex,
        user_id: 1,
        public: mealsObj[ date ][ mealIndex ].length >= 3,
        postWorkout: mealIndex === 4
      } );
      // Turn mealsObj into a map
      mealsObj[ date ][ mealIndex ] = mealsArr.length;
    } );
  } );

  records = records.map( record => {
    record.mealId = mealsObj[ record.Date ][ record.Meal ];
    return record;
  } );

  return { records, mealsArr };
}

