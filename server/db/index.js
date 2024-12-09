const sequelize = require( './conn' );

const Abbrev = require( './models/abbrev' );
const AbbrevMicro = require( './models/abbrev-micro' );
const FoodDesc = require( './models/food-des' );
const Weight = require( './models/weight' );
const FoodRecord = require( './models/food-record' );
const User = require( './models/user' );
const UserMeasurement = require( './models/user-measurements' );
const MealGoals = require( './models/meal-goals' );
const FoodGroup = require( './models/food-group' );
const Meal = require( './models/meal' );
const Program = require( './models/program' );

const abbrevId = { foreignKey: 'abbrev_id' };
const userId = { foreignKey: 'user_id' };
const FdGrpCd = { foreignKey: 'FdGrp_Cd' };

AbbrevMicro.belongsTo( Abbrev, abbrevId );
Abbrev.hasOne( AbbrevMicro, abbrevId );

FoodDesc.belongsTo( Abbrev, abbrevId );
Abbrev.hasOne( FoodDesc, abbrevId );

FoodDesc.belongsTo( FoodGroup, FdGrpCd );
FoodGroup.hasMany( FoodDesc, FdGrpCd );

FoodRecord.belongsTo( Meal );
Meal.hasMany( FoodRecord );

FoodRecord.belongsTo( Abbrev, abbrevId );
Abbrev.hasMany( FoodRecord, abbrevId );

FoodRecord.belongsTo( User, userId );
User.hasMany( FoodRecord, userId );

Meal.belongsTo( User, userId );
User.hasMany( Meal, userId );

MealGoals.belongsTo( User, userId );
User.hasMany( MealGoals, userId );

Program.belongsTo( User, userId );
User.hasMany( Program, userId );

UserMeasurement.belongsTo( User, userId );
User.hasMany( UserMeasurement, userId );

Weight.belongsTo( Abbrev, abbrevId );
Abbrev.hasMany( Weight, abbrevId );

module.exports = {
  sequelize,
  Abbrev,
  AbbrevMicro,
  FoodDesc,
  Weight,
  FoodRecord,
  Meal,
  User,
  UserMeasurement,
  Program,
  MealGoals,
  FoodGroup
};

