const router = require( 'express' ).Router();
const db = require( '../db' );

module.exports = router;

router.get( '/list', ( req, res, next ) => {
  db.FoodRecord.scope( 'foodGroup' ).findAll( {
      where: {
        Date: {
          $gte: new Date( req.query.date )
        },
        user_id: res.locals.user_id
      }
    } )
    .then( records => {
      res.json( records );
    } )
    .catch( next );
} );

