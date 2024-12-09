const router = require( 'express' ).Router();
const db = require( '../db' );

router.get( '/:date', ( req, res, next ) => {

  if ( !res.locals.user_id ) throw new Error( `The user_id must be specified` );

  db.FoodRecord.findByDate( req.params.date, res.locals.user_id )
    .then( records => {
      res.json( records.map( record => record.calMacros() ) );
    } )
    .catch( next );
} );

router.post( '/', ( req, res, next ) => {
  db.FoodRecord.createWithMeal( Object.assign( req.body, { user_id: res.locals.user_id } ) )
    .then( food => res.status( 201 ).json( food ) )
    .catch( next );
} );

router.delete( '/', ( req, res, next ) => {
  db.sequelize.transaction( del => {
      let meal;
      return db.FoodRecord.findById( req.body.id, {
          include: [ db.Meal ]
        } )
        .then( foodrecord => {
          meal = foodrecord.meal;
          return foodrecord.destroy( { transaction: del } );
        } )
        .then( () => db.Meal.findById( meal.id ) )
        .then( _meal => {
          if ( _meal ) {
            _meal.public = false;
            return _meal.save( { transaction: del } );
          }
        } );
    } )
    .then( _meal => res.status( 204 ).json( _meal ) )
    .catch( next );
} );

router.put( '/meal', ( req, res, next ) => {
  db.Meal.findOne( {
      where: {
        id: req.body.mealId,
        user_id: res.locals.user_id
      }
    } )
    .then( meal => {
      meal.public = true;
      return meal.save();
    } )
    .then( meal => res.json( meal ) );
} );

router.put( '/quantity/:id', ( req, res, next ) => {
  db.FoodRecord.findById( req.params.id )
    .then( record => record.updateQuantity( req.body ) )
    .then( () => db.FoodRecord.scope( 'abbrev' ).findById( req.params.id ) )
    .then( record => res.json( record.calMacros() ) )
    .catch( next );
} );

router.put( '/:recordId/:status', ( req, res, next ) => {
  db.FoodRecord.findById( req.params.recordId )
    .then( record => {
      record.confirmed = req.params.status;
      return record.save();
    } )
    .then( record => res.json( record ) )
    .catch( next );
} );

module.exports = router;

