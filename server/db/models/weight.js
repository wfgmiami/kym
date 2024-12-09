const sequelize = require( '../conn' );
const { Sequelize } = sequelize;

module.exports = sequelize.define( 'weight', {
  Seq: {
    type: Sequelize.INTEGER
  },
  Amount: {
    type: Sequelize.DECIMAL
  },
  Description: {
    type: Sequelize.STRING
  },
  Gr_Wgt: {
    type: Sequelize.DECIMAL
  }
}, {
  getterMethods: {
    normalized() {
      return {
        val: this.Seq,
        txt: `${this.Description} (${Math.round( this.Gr_Wgt / this.Amount * 10 ) / 10} g)`
      };
    }
  }
} );

