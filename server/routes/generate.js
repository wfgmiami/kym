const router = require( 'express' ).Router();
const db = require( '../db' );

router.get( '/', ( req, res, next ) => {
  db.FoodDesc.findAll( {
      where: {
        FdGrp_Cd: Math.floor( Math.random() * 10 + 1 ) * 100
      },
      include: [ db.Abbrev ]
    } )
    .then( foods => res.json( { id: foods[ Math.floor( Math.random() * foods.length ) ].abbrev_id, foodName: foods[ Math.floor( Math.random() * foods.length ) ].Short_Desc } ) )
    .catch( next );
} );

router.get( '/calculate', ( req, res, next ) => {
  const { proteinGoal, carbGoal, fatGoal } = req.query;

  let result = db.Abbrev.fpCalculateMacros( { proteinGoal, carbGoal, fatGoal } )

  res.json( result );

} );


module.exports = router;

