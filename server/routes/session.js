const router = require( 'express' ).Router();
const User = require( '../db/models/user' );
const jwt = require( 'jwt-simple' );

module.exports = router;

router.use( ( req, res, next ) => {
  res.locals = {
    jwtSecret: process.env.SECRET || '1701-Flex-NY'
  };
  next();
} );

router.post( '/', ( req, res, next ) => {
  const { username, password } = req.body;
  User.findByPassword( { username, password } )
    .then( user => {
      if ( !user ) return res.sendStatus( 401 );

      res.send( {
        token: jwt.encode( { id: user.id }, res.locals.jwtSecret )
      } );

    } )
    .catch( next );
} );

router.get( '/:token', ( req, res, next ) => {
  try {
    const token = jwt.decode( req.params.token, res.locals.jwtSecret );
    User.scope( 'measurements', 'meal-goals', 'programs' ).findById( token.id || token.token )
      .then( user => {
        if ( !user ) return res.sendStatus( 401 );
        res.send( user );
      } );
  } catch ( err ) {
    next( err );
  }
} );

