const sequelize = require( '../conn' );
const { Sequelize } = sequelize;

const axios = require( 'axios' );
const md5 = require( 'crypto-md5' );

const UserMeasurement = require( './user-measurements' );
const MealGoals = require( './meal-goals' );
const Meal = require( './meal' );
const Program = require( './program' );
const app = require( '../../app' );

const User = sequelize.define( 'user', {
  firstname: {
    type: Sequelize.STRING,
  },
  lastname: {
    type: Sequelize.STRING,
  },
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.TEXT,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING
  },
  birthdate: {
    type: Sequelize.DATEONLY
  },
  googleId: {
    type: Sequelize.STRING
  },
  fitbitId: {
    type: Sequelize.STRING
  },
  fitbitToken: {
    type: Sequelize.STRING
  },
  fitbitRefreshToken: {
    type: Sequelize.STRING
  }
}, {
  scopes: {
    measurements: {
      include: [ {
        model: UserMeasurement,
        order: [
          sequelize.fn( 'max', sequelize.col( 'id' ) )
        ]
      } ]
    },
    'meal-goals': {
      include: [ {
        model: MealGoals,
        order: [
          sequelize.fn( 'max', sequelize.col( 'id' ) )
        ]
      } ]
    },
    programs: {
      include: [ {
        model: Program,
        order: [
          sequelize.fn( 'max', sequelize.col( 'id' ) )
        ]
      } ]
    },
    meals: {
      include: [
        Meal.scope( 'records' )
      ]
    }
  },
  hooks: {
    beforeCreate( user ) {
      user.password = md5( user.password, 'hex' );
      return user;
    },
    beforeBulkCreate( users ) {
      users = users.map( user => {
        user.password = md5( user.password, 'hex' );
        return user;
      } );
      return users;
    }
  },
  classMethods: {
    findByPassword( credentials ) {
      if ( !credentials ) throw new Error( 'No credentials provided' );
      if ( !credentials.password ) throw new Error( 'Password must be included in credentials' );
      credentials.password = md5( credentials.password, 'hex' );
      return this.scope( 'measurements', 'meal-goals' ).findOne( { where: credentials } );
    },
    setupFitbit( profile, token, refreshToken ) {
      let _user;
      const { user } = profile._json;
      return this.findOrCreate( {
          where: { fitbitId: profile.id },
          defaults: {
            fitbitToken: token,
            fitbitRefreshToken: refreshToken,
            firstname: user.firstName,
            lastname: user.lastName,
            password: profile.id,
            birthdate: new Date( new Date( user.dateOfBirth ).getTime() - user.offsetFromUTCMillis ),
          }
        } )
        .spread( __user => {
          _user = __user;
          return UserMeasurement.findOrCreate( {
              where: { user_id: _user.id },
              defaults: {
                gender: user.gender,
                height: Math.round( user.height * 0.393701 ),
                units: 'imperial',
                weight: Math.round( user.weight * 2.20462 ),
                lifestyle: 'Normal'
              }
            } )
            .spread( measure => Program.create( Program.makeProgramObject( measure ) ) )
            .then( () => _user );
        } );
    },
    requestCalories( user_id, startDate, endDate ) {
      let token, fitbitId, refreshToken;
      return this.findOne( {
          where: {
            id: user_id
          }
        } )
        .then( user => {
          token = user.fitbitToken;
          fitbitId = user.fitbitId;
          refreshToken = user.fitbitRefreshToken;
        } )
        .then( () => Program.findOne( {
          where: { user_id },
          order: [
            [ 'createdAt', 'DESC' ]
          ]
        } ) )
        .then( program => {
          if ( startDate ) {
            startDate = startDate.slice( 0, 10 );
          } else {
            startDate = formatDate( program.startDate );
          }

          if ( endDate ) {
            endDate = endDate.slice( 0, 10 );
          } else if ( startDate ) {
            endDate = startDate;
          } else {
            endDate = formatDate( program.endDate );
          }
          return { token, fitbitId, endDate, startDate };
        } )
        .then( () => {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          return axios.get( `https://api.fitbit.com/1/user/${fitbitId}/activities/calories/date/${startDate}/${endDate}.json` );
        } )
        .catch( data => {
          return { data, error: true, refreshToken };
        } );
    },
    exRefreshToken( refTok, user_id ) {
      return axios.post( `https://api.fitbit.com/oauth2/token?grant_type=refresh_token&refresh_token=${refTok}`, null, {
          headers: {
            Authorization: `Basic ${app.get('oauth').fitbitInfo.refreshBuffer}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        } )
        .then( ( { data } ) => {
          const { access_token, refresh_token } = data;
          this.findById( user_id )
            .then( user => {
              user.fitbitToken = access_token;
              user.fitbitRefreshToken = refresh_token;
              return user.save();
            } );
        } )
        .then( () => this.requestCalories( user_id, startDate, endDate ) );
    }
  }
} );

module.exports = User;

function formatDate( dateObj ) {
  const year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let date = dateObj.getDate();

  month = month < 10 ? `0${month}` : month;
  date = date < 10 ? `0${date}` : date;

  return `${year}-${month}-${date}`;
}

