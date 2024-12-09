const router = require( 'express' ).Router();
const db = require( '../db' );

module.exports = router;

router.get( '/calories', ( req, res, next ) => {
  let { startDate, endDate } = req.query;
  db.User.requestCalories( res.locals.user_id, startDate, endDate )
    .then( ( { data, error, refreshToken } ) => {
      if ( !error ) {
        return res.json( data[ 'activities-calories' ] );
      } else {
        // If there's an error, it's because the token was expired, so get a new one
        db.User.exRefreshToken( refreshToken, res.locals.user_id )
          .then( ( result ) => res.json( result ) )
          .catch( result => {
            console.log( result );
            res.sendStatus( 500 );
          } );
      }
    } )
    .catch( ( data ) => {
      console.log( data );
      res.status( 500 ).json( data );
    } );
} );

