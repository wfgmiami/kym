const sequelize = require( '../conn' );
const { Sequelize } = sequelize;

const FoodGroup = require( './food-group' );

module.exports = sequelize.define( 'foodDesc', {
  Long_Desc: {
    type: Sequelize.TEXT
  },
  Short_Desc: {
    type: Sequelize.STRING
  },
  ComName: {
    type: Sequelize.STRING
  },
  ManufacName: {
    type: Sequelize.STRING
  },
  Survey: {
    type: Sequelize.STRING
  },
  Ref_desc: {
    type: Sequelize.STRING
  },
  Refuse: {
    type: Sequelize.INTEGER
  },
  SciName: {
    type: Sequelize.TEXT
  },
  N_Factor: {
    type: Sequelize.DECIMAL
  },
  Pro_Factor: {
    type: Sequelize.DECIMAL
  },
  Fat_Factor: {
    type: Sequelize.DECIMAL
  },
  CHO_Factor: {
    type: Sequelize.DECIMAL
  }
}, {
  scopes: {

    foodGroup: {
      include: [ FoodGroup ]
    },
  }
} );

