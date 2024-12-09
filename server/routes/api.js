const router = require( 'express' ).Router();
const app = require( '../' );
const jwt = require( 'jwt-simple' );

router.use( ( req, res, next ) => {
  res.locals = {
    jwtSecret: app.get( 'jwtSecret' )
  };

  if ( req.query.token ) {
    Object.assign( res.locals, {
      user_id: jwt.decode( req.query.token, app.get( 'jwtSecret' ) ).id || jwt.decode( req.query.token, app.get( 'jwtSecret' ) ).token
    } );
  }

  next();
} );

[
  'calculate',
  'food',
  'food-record',
  'generate',
  'goals',
  'meal',
  'programs',
  'session',
  'user',
  'fitbit',
  'shopping-list'
].forEach( pth => router.use( `/${pth}`, require( `./${pth}` ) ) );


module.exports = router;
