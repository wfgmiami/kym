const sequelize = require( '../conn' );
const { Sequelize } = sequelize;

module.exports = sequelize.define( 'mealGoals', {
  goals: {
    type: Sequelize.JSON
  }
}, {
  hooks: {
    beforeCreate( memo ) {
      // console.log(memo);
      tr( 'train' );
      tr( 'rest' );

      function tr( param ) {
        if ( !memo.goals[ param ] ) throw new Error( `There must be goals for ${param}` );
        if ( memo.goals[ param ].length !== 6 ) throw new Error( `There must be goals for six meals on a ${param} day` );
        memo.goals[ param ].forEach( item => {
          console.log(item);
          if ( typeof item !== 'object' ) {
            throw new Error( 'Each goal must be a JSON object' );
          }
          [ 'protein', 'carbs', 'fat' ].forEach( gl => {
            console.log(item[ gl ]);
            if ( typeof item[ gl ] !== 'number' ) {
              throw new Error( `There must be a value for ${gl}` );
            }
          } );
        } );
      }
    },
    beforeUpdate() {
      throw new Error( 'Goals cannot be modified. Create new goals instead.' );
    }
  }
} );

