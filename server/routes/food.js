const router = require( 'express' ).Router();
const db = require( '../db' );

router.get( '/:foodname', ( req, res, next ) => {
  const { micro } = req.query;

  let food = req.params.foodname.split( ' ' );

  db.Abbrev.scope( micro ? 'micro' : null ).findAll( {
      where: {
        $and: food.map( fd => ( {
          $or: [
            { Main: { $iLike: `%${fd}%` } },
            { Sub: { $iLike: `%${fd}%` } }
          ],
        } ) )
      },
      order: [ 'Main' ],
      include: [ db.FoodDesc, db.Weight ]
    } )
    .then( abbrev => res.json( abbrev ) )
    .catch( next );
} );


module.exports = router;
