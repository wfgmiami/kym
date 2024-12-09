const router = require( 'express' ).Router();
const db = require( '../db' );

module.exports = router;

router.get( '/', ( req, res, next ) => {
  let where = {
    user_id: {
      $ne: res.locals.user_id
    },
    public: true
  };
  if ( req.query.meals ) {
    Object.assign( where, { meal: { $or: req.query.meals } } );
  }
  if ( req.query.postWorkout === 'true' ) {
    Object.assign( where, { postWorkout: true } );
  }
  let inclWhere = {};
  if ( req.query.keyword ) {
    Object.assign( inclWhere, {
      $and: req.query.keyword.split( ' ' ).map( fd => ( {
        $or: [
          { Main: { $iLike: `%${fd}%` } },
          { Sub: { $iLike: `%${fd}%` } }
        ],
      } ) )
    } );
  }

  db.Meal.findAll( {
      where,
      include: [ {
        model: db.FoodRecord,
        include: [ {
          model: db.Abbrev,
          where: inclWhere
        } ],
      } ],
      order: [
        [ 'id', 'DESC' ]
      ],
      limit: 15
    } )
    .then( meals => {
      return db.Meal.findAll( {
        where: {
          $or: meals.map( meal => ( { id: meal.id } ) ),
        },
        include: [ {
          model: db.FoodRecord,
          include: [ db.Abbrev ]
        } ]
      } );
    } )
    .then( meals => res.json( meals ) )
    .catch( next );
} );

