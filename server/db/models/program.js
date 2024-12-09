const sequelize = require( '../conn' );
const { Sequelize } = sequelize;

const Program = sequelize.define( 'program', {
  startWeight: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  endGoal: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  endWeight: {
    type: Sequelize.DECIMAL
  },
  startDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM,
    values: [ 'In Progress', 'Compete' ],
    allowNull: false,
    defaultValue: 'In Progress'
  },
  result: {
    type: Sequelize.ENUM,
    values: [ 'TBD', 'Success', 'Failure' ],
    allowNull: false
  },

}, {
  classMethods: {
    makeProgramObject(measure) {
      const { units, weight } = measure;
      const startWeight = weight * 1;
      let endGoal;
      if ( units === 'imperial' ) {
        endGoal = weight * 1 - 5;
      } else {
        endGoal = Math.round( ( weight * 1 - 5 / 2.2 ) * 10 ) / 10;
      }
      const startDate = new Date();
      const endDate = new Date( new Date().getTime() + 86400000 * 35 );

      return {
        startWeight,
        endGoal,
        startDate,
        endDate,
        status: 'In Progress',
        user_id: measure.user_id,
        result: 'TBD'
      };
    }
  }
} );

module.exports = Program;
