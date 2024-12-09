const sequelize = require( '../conn' );
const { Sequelize } = sequelize;

module.exports = sequelize.define( 'foodGroup', {
  GroupID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  Description: {
    type: Sequelize.STRING
  },
} );

