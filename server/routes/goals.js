const router = require( 'express' ).Router();
const db = require( '../db' );

module.exports = router;

router.post( '/meals', ( req, res, next ) => {
  db.MealGoals.create( { goals: req.body, user_id: res.locals.user_id } )
    .then( meal => res.json( meal ) )
    .catch( next );
} );

