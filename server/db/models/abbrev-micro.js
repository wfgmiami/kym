const sequelize = require( '../conn' );
const { Sequelize } = sequelize;

module.exports = sequelize.define( 'abbrevMicro', {
    Water: {
      type: Sequelize.DECIMAL
    },
    Ash: {
      type: Sequelize.DECIMAL
    },
    Fiber: {
      type: Sequelize.DECIMAL
    },
    Sugar: {
      type: Sequelize.DECIMAL
    },
    Calcium: {
      type: Sequelize.DECIMAL
    },
    Iron: {
      type: Sequelize.DECIMAL
    },
    Magnesium: {
      type: Sequelize.DECIMAL
    },
    Phosphorus: {
      type: Sequelize.DECIMAL
    },
    Potassium: {
      type: Sequelize.DECIMAL
    },
    Sodium: {
      type: Sequelize.DECIMAL
    },
    Zinc: {
      type: Sequelize.DECIMAL
    },
    Copper: {
      type: Sequelize.DECIMAL
    },
    Manganese: {
      type: Sequelize.DECIMAL
    },
    Selenium: {
      type: Sequelize.DECIMAL
    },
    Vit_C: {
      type: Sequelize.DECIMAL
    },
    Thiamin: {
      type: Sequelize.DECIMAL
    },
    Riboflavin: {
      type: Sequelize.DECIMAL
    },
    Niacin: {
      type: Sequelize.DECIMAL
    },
    Panto_acid: {
      type: Sequelize.DECIMAL
    },
    Vit_B6: {
      type: Sequelize.DECIMAL
    },
    Folate_Tot: {
      type: Sequelize.DECIMAL
    },
    Folic_acid: {
      type: Sequelize.DECIMAL
    },
    Food_Folate: {
      type: Sequelize.DECIMAL
    },
    Folate_DFE: {
      type: Sequelize.DECIMAL
    },
    Choline_Tot: {
      type: Sequelize.DECIMAL
    },
    Vit_B12: {
      type: Sequelize.DECIMAL
    },
    Vit_A_IU: {
      type: Sequelize.DECIMAL
    },
    Vit_A_RAE: {
      type: Sequelize.DECIMAL
    },
    Retinol: {
      type: Sequelize.DECIMAL
    },
    Alpha_Carot: {
      type: Sequelize.DECIMAL
    },
    Beta_Carot: {
      type: Sequelize.DECIMAL
    },
    Beta_Crypt: {
      type: Sequelize.DECIMAL
    },
    Lycopene: {
      type: Sequelize.DECIMAL
    },
    Lut_Zea: {
      type: Sequelize.DECIMAL
    },
    Vit_E: {
      type: Sequelize.DECIMAL
    },
    Vit_D_mcg: {
      type: Sequelize.DECIMAL
    },
    Vit_D_IU: {
      type: Sequelize.DECIMAL
    },
    Vit_K: {
      type: Sequelize.DECIMAL
    },
    FA_Sat: {
      type: Sequelize.DECIMAL
    },
    FA_Mono: {
      type: Sequelize.DECIMAL
    },
    FA_Poly: {
      type: Sequelize.DECIMAL
    },
    Cholestrl: {
      type: Sequelize.DECIMAL
    }
  },


  {
    instanceMethods: {
      syncAbbrevId() {
        return sequelize.models.abbrev.findOne( { where: { NDB_No: this.NDB_No } } )
          .then( abbrev => {
            if ( abbrev ) {
              this.abbrevId = abbrev.id;
              return this.save();
            }
          } )
          .then( () => console.log( this.NDB_No, this.id, this.abbrevId ) );
      }
    }
  }
);

