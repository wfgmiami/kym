const sequelize = require( '../conn' );
const { Sequelize } = sequelize;
const Abbrev = require( './abbrev' );
const Weight = require( './weight' );

module.exports = sequelize.define( 'foodRecord', {
  Date: {
    type: Sequelize.DATEONLY,
  },
  Meal: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1
    }
  },
  Quantity: {
    type: Sequelize.DECIMAL,
  },
  Unit: {
    type: Sequelize.INTEGER
  },
  fromProgram: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  confirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  scopes: {
    abbrev: {
      include: [ {
        model: Abbrev,
        include: [ Weight ]
      } ]
    },
    foodGroup: {
      include: [ Abbrev.scope( 'foodGroup', 'weight' ) ]
    },
    confirmed: {
      confirmed: true
    }
  },
  instanceMethods: {
    calMacros() {
      if ( this.abbrev && this.abbrev.weights ) {
        const weight = this.abbrev.weights.filter( wght => wght.Seq * 1 === this.Unit * 1 )[ 0 ];
        const params = [ 'Calories', 'Protein', 'Carbohydrates', 'Fat' ];

        let record = Object.assign( {}, this.get(), this.abbrev.dataValues, {
          id: this.id,
          Quantity: this.Quantity * 1,
          Date: this.Date,
          Unit: weight.Description,
          Seq: this.Unit,
          Gr: Math.round( weight.Gr_Wgt / weight.Amount * ( this.Quantity * 1 ) )
        } );

        params.forEach( param => {
          record[ param ] = Math.round( this.abbrev[ param ] * ( weight.Gr_Wgt / weight.Amount * ( this.Quantity * 1 ) ) / 100 * 10 ) / 10;
        } );

        return record;
      } else {
        throw new Error( 'Include Abbrev to FoodRecord, and Weights to Abbrev' );
      }
    },
    updateQuantity( { quantity, seq } ) {
      this.Quantity = quantity;
      this.Unit = seq;
      return this.save();
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
        },
        include: [ sequelize.models.meal ]
      } );
    },
    makeHistoricalArray( user_id ) {
      return this.scope( 'abbrev' ).findAll( {
          where: { user_id },
          order: [ 'Meal', 'Date' ]
        } )
        .then( record => {

          if ( record.length > 60 ) return record;
          return this.scope( 'abbrev' ).findAll( {
            where: { user_id: 1 },
            order: [ 'Meal', 'Date' ]
          } );
        } )
        .then( record => {
          return record.reduce( ( memo, rc ) => {
            const date = rc.Date.toDateString();
            if ( !memo[ rc.Meal - 1 ][ date ] ) memo[ rc.Meal - 1 ][ date ] = [];
            let memoContainsRecordAlready = memo[ rc.Meal - 1 ][ date ].filter( rec => rec.id === rc.id ).length;
            if ( !memoContainsRecordAlready ) memo[ rc.Meal - 1 ][ date ].push( rc );
            return memo;
          }, [ {}, {}, {}, {}, {}, {} ] );
        } )
        .then( record => {
          Object.keys( record ).forEach( meal => {
            Object.keys( record[ meal ] ).forEach( date => {
              if ( record[ meal ][ date ].length < 3 ) delete record[ meal ][ date ];
            } );
          } );
          return record;
        } );
    },
    createWithMeal( { abbrev_id, date, meal, quantity, unit, user_id, confirmed } ) {
      let food;
      return this.create( {
          abbrev_id,
          Date: date,
          Meal: meal,
          Quantity: quantity,
          Unit: unit,
          user_id,
          confirmed
        } )
        .then( _food => {
          food = _food;
          return sequelize.models.meal.findOrCreate( {
            where: {
              user_id,
              date,
              meal
            }
          } );
        } )
        .then( _meal => _meal[ 0 ].addFoodRecord( food ) )
        .then( _meal => {
          _meal.public = false;
          return _meal.save();
        } )
        .then( () => this.scope( 'abbrev' ).findById( food.id, {
          include: [ sequelize.models.meal ]
        } ) )
        .then( fd => fd.calMacros() );
    }
  },
} );

