const passport = require( 'passport' );
const GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy;
const FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;
const User = require( './db/models/user' );
const jwt = require( 'jwt-simple' );

module.exports = ( app ) => {
  app.use( passport.initialize() );

  // Google strategy
  passport.use(
    new GoogleStrategy( app.get( 'oauth' ).googleInfo,
      ( token, refreshToken, profile, done ) => {
        let nameArray = profile.displayName.split( ' ' );
        User.findOrCreate( {
            where: { googleId: profile.id },
            defaults: {
              firstname: nameArray[ 0 ],
              lastname: nameArray[ 1 ],
              username: profile.emails[ 0 ].value,
              email: profile.emails[ 0 ].value,
              password: profile.id
            }
          } )
          .spread( user => {
            done( null, user );
          } )
          .catch( done );
      } )


  );

  let pr = {
    provider: 'fitbit',
    id: '5SCKPM',
    displayName: 'Richard L.',
    _json: {
      user: {
        age: 28,
        avatar: 'https://static0.fitbit.com/images/profile/defaultProfile_100_male.png',
        avatar150: 'https://static0.fitbit.com/images/profile/defaultProfile_150_male.png',
        avatar640: 'https://static0.fitbit.com/images/profile/defaultProfile_640_male.png',
        averageDailySteps: 4559,
        clockTimeDisplayFormat: '12hour',
        corporate: false,
        corporateAdmin: false,
        dateOfBirth: '1989-06-02',
        displayName: 'Richard L.',
        displayNameSetting: 'name',
        distanceUnit: 'en_US',
        encodedId: '5SCKPM',
        features: [ { exerciseGoal: true } ],
        firstName: 'Richard',
        foodsLocale: 'en_US',
        fullName: 'Richard Lucas',
        gender: 'MALE',
        glucoseUnit: 'en_US',
        height: 185,
        heightUnit: 'en_US',
        lastName: 'Lucas',
        locale: 'en_US',
        memberSince: '2017-06-10',
        mfaEnabled: false,
        offsetFromUTCMillis: -14400000,
        startDayOfWeek: 'SUNDAY',
        strideLengthRunning: 116.30000000000001,
        strideLengthRunningType: 'default',
        strideLengthWalking: 76.80000000000001,
        strideLengthWalkingType: 'default',
        swimUnit: 'en_US',
        timezone: 'America/New_York',
        topBadges: [ {
          badgeGradientEndColor: 'B0DF2A',
          badgeGradientStartColor: '00A550',
          badgeType: 'DAILY_STEPS',
          category: 'Daily Steps',
          cheers: [],
          dateTime: '2017-06-11',
          description: '5,000 steps in a day',
          earnedMessage: 'Congrats on earning your first Boat Shoe badge!',
          encodedId: '228TQ4',
          image100px: 'https://static0.fitbit.com/images/badges_new/100px/badge_daily_steps5k.png',
          image125px: 'https://static0.fitbit.com/images/badges_new/125px/badge_daily_steps5k.png',
          image300px: 'https://static0.fitbit.com/images/badges_new/300px/badge_daily_steps5k.png',
          image50px: 'https://static0.fitbit.com/images/badges_new/badge_daily_steps5k.png',
          image75px: 'https://static0.fitbit.com/images/badges_new/75px/badge_daily_steps5k.png',
          marketingDescription: 'You\'ve walked 5,000 steps And earned the Boat Shoe badge!',
          mobileDescription: 'Congratulations on cruising your way to the first Fitbit daily step badge.',
          name: 'Boat Shoe (5,000 steps in a day)',
          shareImage640px: 'https://static0.fitbit.com/images/badges_new/386px/shareLocalized/en_US/badge_daily_steps5k.png',
          shareText: 'I took 5,000 steps and earned the Boat Shoe badge! #Fitbit',
          shortDescription: '5,000 steps',
          shortName: 'Boat Shoe',
          timesAchieved: 1,
          value: 5000
        } ],
        waterUnit: 'en_US',
        waterUnitName: 'fl oz',
        weight: 85.7,
        weightUnit: 'en_US'
      }
    }
  };

  // Fitbit strategy
  passport.use(
    new FitbitStrategy( app.get( 'oauth' ).fitbitInfo,
      ( token, refreshToken, profile, done ) => {
        User.setupFitbit( profile, token, refreshToken )
          .then( user => done( null, user ) )
          .catch( done );
      } )
  );

  app.get( '/api/auth/google', passport.authenticate( 'google', {
    scope: 'email',
    session: false
  } ) );

  // passport will exchange token from google with a token which we can use.
  app.get( app.get( 'oauth' ).googleInfo.callbackURL,
    passport.authenticate( 'google', {
      failureRedirect: '/',
      session: false
    } ),
    ( req, res, next ) => {
      var jwtToken = jwt.encode( { id: req.user.id }, app.get( 'jwtSecret' ) );
      res.redirect( `/?token=${jwtToken}` );
    } );

  app.get( '/api/auth/fitbit',
    passport.authenticate( 'fitbit', {
      scope: [ 'profile', 'activity', 'nutrition', 'weight', 'settings' ]
    } ) );

  app.get( app.get( 'oauth' ).fitbitInfo.callbackURL,
    passport.authenticate( 'fitbit', {
      failureRedirect: '/',
      session: false
    } ),
    ( req, res, next ) => {
      var fitbitToken = jwt.encode( { id: req.user.id }, app.get( 'jwtSecret' ) );
      res.redirect( `/?token=${fitbitToken}` );
    } );


};

