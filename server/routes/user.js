const router = require( 'express' ).Router();
const db = require( '../db' );

module.exports = router;

router.get( '/', ( req, res, next ) => {
  db.User.scope( 'measurements', 'meal-goals', 'programs' ).findById( res.locals.user_id )
    .then( user => res.json( user ) )
    .catch( next );
} );

router.post( '/signup', ( req, res, next ) => {
  db.User.create( req.body )
    .then( user => {
      res.send( user );
    } )
    .catch( next );
} );

router.post( '/measurements', ( req, res, next ) => {
  db.UserMeasurement.create( Object.assign( req.body, { user_id: res.locals.user_id } ) )
    .then( meas => res.json( meas ) )
    .catch( next );
} );

router.delete( '/measurements', ( req, res, next ) => {
  db.UserMeasurement.findOne( {
      where: {
        id: req.body.id,
        user_id: res.locals.user_id
      }
    } )
    .then( measurement => {
      if ( measurement ) {
        return measurement.destroy();
      }
    } )
    .then( () => {
      res.sendStatus( 204 );
    } );
} );

