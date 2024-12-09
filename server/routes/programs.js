const router = require( 'express' ).Router();
const db = require( '../db' );

module.exports = router;

router.get( '/', ( req, res, next ) => {
  db.Program.findOne( {
      where: {
        user_id: res.locals.user_id,
        status: 'In Progress'
      }
    } )
    .then( program => res.json( program ) )
    .catch( next );
} );

router.post( '/', ( req, res, next ) => {
  const { units, weight } = req.body;
  const startWeight = weight * 1;
  let endGoal;
  if ( units === 'imperial' ) {
    endGoal = weight * 1 - 5;
  } else {
    endGoal = Math.round( ( weight * 1 - 5 / 2.2 ) * 10 ) / 10;
  }
  const startDate = new Date();
  const endDate = new Date( new Date().getTime() + 86400000 * 35 );

  db.Program.create( {
      startWeight,
      endGoal,
      startDate,
      endDate,
      status: 'In Progress',
      user_id: res.locals.user_id,
      result: 'TBD'
    } )
    .then( program => res.json( program ) )
    .catch( next );
} );
