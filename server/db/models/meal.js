const sequelize = require( '../conn' );
const { Sequelize } = sequelize;

const FoodRecord = require('./food-record');

const Meal = sequelize.define( 'meal', {
  date: {
    type: Sequelize.DATEONLY
  },
  meal: {
    type: Sequelize.INTEGER
  },
  public: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  postWorkout: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  scopes: {
    records: {
      include: [ FoodRecord ]
    }
  },
  classMethods: {
    findByDate( date, user_id ) {
      if ( !user_id ) throw new Error( 'No user_id specified' );
      if ( typeof date === 'string' ) {
        date = new Date( date );
      }

      return this.scope( 'abbrev' ).findAll( {
        where: {
          Date: date,
          user_id
        }
      } );
    }
  }
} );

module.exports = Meal;

