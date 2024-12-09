const sequelize = require( '../conn' );
const { Sequelize } = sequelize;
const Weight = require( './weight' );
const AbbrevMicro = require( './abbrev-micro' );
const MealGoals = require( './meal-goals' );
const filteredMeals = require( '../data/filteredmeals' );
const FoodDesc = require( './food-des' );

module.exports = sequelize.define( 'abbrev', {
    Main: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    Sub: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    Calories: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    Protein: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    Fat: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    Carbohydrates: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    GmWt_1: {
      type: Sequelize.DECIMAL
    },
    GmWt_Desc1: {
      type: Sequelize.STRING
    },
    GmWt_2: {
      type: Sequelize.DECIMAL
    },
    GmWt_Desc2: {
      type: Sequelize.STRING
    },
    UserID: {
      type: Sequelize.INTEGER
    }
  },

  {
    getterMethods: {
      longname() {
        return `${this.Main}, ${this.Sub}`;
      },
      maxMacro() {
        let arr = [
          { macro: 'Protein', value: this.Protein * 1 },
          { macro: 'Carbohydrates', value: this.Carbohydrates * 1 },
          { macro: 'Fat', value: this.Fat * 1 }
        ];

        arr = arr.sort( ( a, b ) => {
          if ( a.value > b.value ) return -1;
          if ( a.value < b.value ) return 1;
          if ( a.value === b.value ) return 0;
        } );

        return arr[ 0 ].macro;
      }
    },

    scopes: {
      weight: {
        include: [
          Weight
        ]
      },
      foodGroup: {
        include: [ FoodDesc.scope( 'foodGroup' ) ]
      },
      micro: {
        include: [
          AbbrevMicro
        ]
      }
    },

    hooks: {
      beforeBulkCreate( abbrevs, options ) {
        abbrevs.forEach( abbrev => {
          if ( abbrev.GmWt_Desc1 && abbrev.GmWt_Desc1.charAt( 0 ) === '.' ) {
            abbrev.GmWt_Desc1 = `0${abbrev.GmWt_Desc1}`;
          }
          if ( abbrev.GmWt_Desc2 && abbrev.GmWt_Desc2.charAt( 0 ) === '.' ) {
            abbrev.GmWt_Desc2 = `0${abbrev.GmWt_Desc2}`;
          }
          if ( abbrev.UserID ) {
            abbrev.user_id = abbrev.UserID;
          }
          if ( abbrev.user_id === '0' ) {
            abbrev.user_id = null;
          }
        } );
      }
    },

    classMethods: {
      calculateMacros( goals, id, _foods, sensitive ) {
        // let start;
        // if ( _foods ) {
        //   start = Promise.resolve( _foods );
        // } else {
        //   start = Promise.all( id.map( ix => this.scope( 'weight' ).findById( ix ) ) );
        // }

        const { proteinGoal, carbGoal, fatGoal } = goals;
        const foods = _foods;
        let oFoods = foods.slice();
        // res.json( { pFood, cFood, fFood } );
        if ( proteinGoal <= 0 || carbGoal <= 0 || fatGoal <= 0 ) {
          return { error: 'Goal macronutrients must be greater than 0' };
        }

        // Factors
        let factors = this.getFactors( foods );

        if ( !factors.pFood.p ) getMax( 'pFood', 'Protein' );
        if ( !factors.cFood.c ) getMax( 'cFood', 'Carbohydrates' );
        if ( !factors.fFood.f ) getMax( 'fFood', 'Fat' );

        function getMax( factor, macro ) {
          factors[ factor ].foods = oFoods.reduce( ( memo, fd ) => {
            if ( fd[ macro ] * 1 > memo[ macro ] ) memo = fd;
            return memo;
          }, { Protein: 0 } );
          factors[ factor ].foods = [ factors[ factor ].foods ];
          factors[ factor ].weight = 100;
          factors[ factor ].p = factors[ factor ].foods[ 0 ].Protein * 1;
          factors[ factor ].c = factors[ factor ].foods[ 0 ].Carbohydrates * 1;
          factors[ factor ].f = factors[ factor ].foods[ 0 ].Fat * 1;
        }

        const { alpha, beta, gamma } = this.calcWeights( factors, proteinGoal, carbGoal, fatGoal );


        let cG = Math.round( alpha );
        let spG = Math.round( beta );
        let aG = Math.round( gamma );

        const convertOz = gr => Math.round( gr * 10 / 28.4 ) / 10;

        const getRes = ( gr, factor ) => ( {
          foods: factor.foods,
          weight: {
            gr,
            oz: convertOz( gr )
          },
          macros: this.getMacros( gr, factor )
        } );

        if ( sensitive && ( alpha > 400 || beta > 400 || gamma > 400 ) ) {
          return {
            error: 'These foods require really high quantities to reach your goal',
            result: [
              getRes( cG, factors.pFood ),
              getRes( spG, factors.cFood ),
              getRes( aG, factors.fFood )
            ]
          };
        }

        if ( alpha >= 0 && beta >= 0 && gamma >= 0 ) {
          return [
            getRes( cG, factors.pFood ),
            getRes( spG, factors.cFood ),
            getRes( aG, factors.fFood )
          ];
        } else {
          return {
            error: 'These foods cannot create a meal with your desired macronutrients',
            factors
          };
        }


      },
      fpCalculateMacros( goals ) {

        const { proteinGoal, carbGoal, fatGoal } = goals;
        let oFoods = filteredMeals.slice();

        if ( proteinGoal <= 0 || carbGoal <= 0 || fatGoal <= 0 ) {
          return { error: 'Goal macronutrients must be greater than 0' };
        }

        let cnt = 0;
        let regenerate = true;
        let data = [];

        while (regenerate && cnt < 20){
          let selectedFood = [];

          for ( let i = 0; i < 4; i++){

            let rndFirst = Math.floor( Math.random() * ( filteredMeals.length - 1 ));
            let rndSecond = Math.floor( Math.random() * filteredMeals[rndFirst].length );
            let rndThird = Math.floor( Math.random() * filteredMeals[rndFirst][rndSecond].length );
            let foodToPush = filteredMeals[rndFirst][rndSecond][rndThird];

            if ( selectedFood.filter( food => food.id === foodToPush.id ).length !== 0 ) {
              i--;
            } else {
              selectedFood.push( foodToPush );
            }
          }

          let factors = this.getFactors( selectedFood );

          if ( !factors.pFood.p ) getMax( 'pFood', 'Protein' );
          if ( !factors.cFood.c ) getMax( 'cFood', 'Carbohydrates' );
          if ( !factors.fFood.f ) getMax( 'fFood', 'Fat' );

          function getMax( factor, macro ) {
            factors[ factor ].foods = oFoods.reduce( ( memo, fd ) => {
              if ( fd[ macro ] * 1 > memo[ macro ] ) memo = fd;
              return memo;
            }, { Protein: 0 } );
            factors[ factor ].foods = [ factors[ factor ].foods ];
            factors[ factor ].weight = 100;
            factors[ factor ].p = factors[ factor ].foods[ 0 ].Protein * 1;
            factors[ factor ].c = factors[ factor ].foods[ 0 ].Carbohydrates * 1;
            factors[ factor ].f = factors[ factor ].foods[ 0 ].Fat * 1;
          }


          const { alpha, beta, gamma } = this.calcWeights( factors, proteinGoal, carbGoal, fatGoal );

          let cG = Math.round( alpha );
          let spG = Math.round( beta );
          let aG = Math.round( gamma );

          const convertOz = gr => Math.round( gr * 10 / 28.4 ) / 10;

          const getRes = ( gr, factor ) => ( {
            foods: factor.foods,
            weight: {
              gr,
              oz: convertOz( gr )
            },
            macros: this.getMacros( gr, factor )
          } );

          data = [ getRes( cG, factors.pFood ),
              getRes( spG, factors.cFood ),
              getRes( aG, factors.fFood ) ];

          for ( let i = 0; i < data.length; i++ ) {
            if ( data[ i ].weight.gr < 0 || data[ i ].weight.oz < 0 || !data[ i ].weight.gr || !data[ i ].weight.oz ) {
              cnt++;
              regenerate = false;
              break;
            }
          }

          regenerate = !regenerate;
        }

        return data;

      },
      getFactors( foods ) {
        let fc = foods.reduce( ( memo, food ) => {
          memo[ food.maxMacro ].push( food );
          return memo;
        }, { Protein: [], Carbohydrates: [], Fat: [] } );

        let fct = { pFood: reduceFoods( fc.Protein ), cFood: reduceFoods( fc.Carbohydrates ), fFood: reduceFoods( fc.Fat ) };

        ensureBalance( 'fFood', 'Fat', () => Object.assign( fct, { pFood: reduceFoods( fc.Protein ), cFood: reduceFoods( fc.Carbohydrates ) } ) );
        ensureBalance( 'pFood', 'Protein', () => Object.assign( fct, { cFood: reduceFoods( fc.Carbohydrates ) } ) );
        ensureBalance( 'cFood', 'Carbohydrates' );

        function ensureBalance( type, macro, cb ) {
          if ( fct[ type ].weight === 0 ) {
            fct[ type ].foods = foods.reduce( ( memo, fd ) => {
              if ( fd[ macro ] * 1 > memo[ macro ] ) {
                memo = fd;
              }
              return memo;
            }, { Fat: 0 } );
            fct[ type ].foods = [ fct[ type ].foods ];
            fct[ type ].weight = 100;
            fct[ type ].p = fct[ type ].foods[ 0 ].Protein * 1;
            fct[ type ].c = fct[ type ].foods[ 0 ].Carbohydrates * 1;
            fct[ type ].f = fct[ type ].foods[ 0 ][ macro ] * 1;
            foods = foods.slice( 0 ).filter( fd => {
              return fd.id !== fct[ type ].foods[ 0 ].id;
            } );
          }

          fc = foods.reduce( ( memo, food ) => {
            memo[ food.maxMacro ].push( food );
            return memo;
          }, { Protein: [], Carbohydrates: [], Fat: [] } );
          if ( cb ) cb();
        }
        return fct;

        function reduceFoods( foodArr ) {
          return foodArr.reduce( ( memo, food ) => {
            memo.p += food.Protein * 1;
            memo.c += food.Carbohydrates * 1;
            memo.f += food.Fat * 1;
            memo.weight += 100;
            memo.foods.push( food );
            return memo;
          }, { p: 0, c: 0, f: 0, weight: 0, foods: [] } );
        }
      },

      getMacros( gr, factor ) {
        return {
          protein: Math.round( gr * factor.p * 10 / factor.weight ) / 10,
          carbs: Math.round( gr * factor.c * 10 / factor.weight ) / 10,
          fat: Math.round( gr * factor.f * 10 / factor.weight ) / 10
        };
      },

      calcWeights( factors, pGoal, cGoal, fGoal ) {
        // Gram weights of the foods
        let alpha = 30;
        let beta = 30;
        let gamma = 30;

        const { pFood, cFood, fFood } = factors;

        // Gauss-Seidel Iteration
        for ( let inc = 0; inc < 20; inc++ ) {
          alpha = ( pFood.weight / pFood.p ) * ( pGoal - cFood.p * beta / cFood.weight - fFood.p * gamma / fFood.weight );
          beta = ( cFood.weight / cFood.c ) * ( cGoal - pFood.c * alpha / pFood.weight - fFood.c * gamma / fFood.weight );
          gamma = ( fFood.weight / fFood.f ) * ( fGoal - pFood.f * alpha / pFood.weight - cFood.f * beta / cFood.weight );
        }
        return { alpha, beta, gamma };
      },

      dayCalculation( user_id, type ) {


        const out = [];

        let goals;

        let meals;

        const getMeal = ( meals, goal, ix ) => {
          if ( goal.protein === 0 && goal.carbs === 0 && goal.fat === 0 ) {
            return null;
          } else {

            // Calculate quantities to reach goal
            const keys = Object.keys( meals[ ix ] );
            const ln = keys.length;

            let result;
            let randomSelection, meal, ids, calcFoods;
            for ( let i = 0; i < 20; i++ ) {
              randomSelection = Math.floor( Math.random() * ln );

              meal = Object.values( meals[ ix ] )[ randomSelection ];
              ids = meal.map( record => record.abbrev_id );
              calcFoods = meal;
              result = this.calculateMacros( { proteinGoal: goal.protein, carbGoal: goal.carbs, fatGoal: goal.fat }, ids, calcFoods, true );
              if ( !result.error ) {
                return result;
              }
            }


            return result;
          }
        };

        return MealGoals.findOne( {
            where: { user_id },
            order: [
              [ 'createdAt', 'DESC' ]
            ]
          } )
          .then( _goals => {
            goals = _goals.goals[ type ];
            // Get all meals, in correct meal slot
            // return db.FoodRecord.makeHistoricalArray( res.locals.user_id );
          } )
          .then( () => {
            meals = filteredMeals;

            meals.forEach( ( meal, ix ) => {
              Object.keys( meal ).forEach( date => {
                let factors = this.getFactors( meal[ date ] );

                function checkFailure( { main, sub1, sub2 }, factor, { prim, sec, min } ) {
                  let check = main / ( factor[ prim ] * factor.weight / 100 );
                  return ( factor[ sec ] * check > sub1 ) || ( factor[ min ] * check > sub2 );
                }

                // Check for obvious failures
                let { protein, carbs, fat } = goals[ ix ];

                if ( checkFailure( { main: protein, sub1: carbs, sub2: fat }, factors.pFood, { prim: 'p', sec: 'c', min: 'f' } ) ) {
                  delete meal[ date ];
                  return;
                }

                if ( checkFailure( { main: carbs, sub1: protein, sub2: fat }, factors.cFood, { prim: 'c', sec: 'p', min: 'f' } ) ) {
                  delete meal[ date ];
                  return;
                }

                if ( checkFailure( { main: fat, sub1: protein, sub2: carbs }, factors.fFood, { prim: 'f', sec: 'p', min: 'c' } ) ) {
                  delete meal[ date ];
                  return;
                }

                let profile = meal[ date ].reduce( ( memo, fd ) => {
                  memo[ fd.maxMacro ] = true;
                  return memo;
                }, {} );

                if ( Object.keys( profile ).length !== 3 ) {
                  delete meal[ date ];
                }
              } );
            } );

            // For each slot, choose a meal at random
            for ( let ix = 0; ix < goals.length; ix++ ) {
              out[ ix ] = getMeal( meals, goals[ ix ], ix );
            }

            return Promise.all( out );
            // When each meal has calculated quantities, send it back
          } )
          .then( output => {
            output.forEach( ( ml, ix ) => {
              if ( ml && ml.error ) {
                out[ ix ] = getMeal( meals, goals[ ix ], ix );
              }
            } );
            return Promise.all( out );
          } );
      }

    }
  }
);

