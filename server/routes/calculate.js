const router = require( 'express' ).Router();
const db = require( '../db' );

module.exports = router;

router.get( '/', ( req, res, next ) => {
  const { proteinGoal, carbGoal, fatGoal, id } = req.query;

  db.Abbrev.calculateMacros( { proteinGoal, carbGoal, fatGoal }, id )
    .then( output => res.json( output ) )
    .catch( next );
} );

router.post( '/masterArray', ( req, res, next ) => {

} );

router.get( '/day', ( req, res, next ) => {
  db.Abbrev.dayCalculation( res.locals.user_id, req.query.type )
    .then( output => res.json( output ) );
} );

