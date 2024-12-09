const router = require( 'express' ).Router();
const passport = require( 'passport' );
const GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy;
const User = require( '../../db/models/user' );
const jwt = require( 'jwt-simple' );

module.exports = ( app ) => {
  app.use( passport.initialize() );

  passport.use(
    new GoogleStrategy( {

        // localhost credentials
        clientID: '996228923588-ma414rr4i6oumg6939tsv45kcn95imv4.apps.googleusercontent.com',
        clientSecret: '4XCnWYcRyxxeb3Xmldy_lIrF',
        callbackURL: '/api/auth/google/verify'

        // AWS credentials
        // clientID: '996228923588-7s60gcbgl6i98l525vv8ipmd6q2ka2f9.apps.googleusercontent.com',
        // clientSecret: '49kvsjJOhmOAtPi4_vf95nCq',
        // callbackURL: '/api/auth/google/verify'

        // http://grace-shopper.herokuapp.com credentials
        // clientID:
        // '996228923588-5n2dv3lkb3td717c3llm0seh36n4bmgj.apps.googleusercontent.com',
        // clientSecret: 'ovEQE8jpRPn0nK0xQSQGgs4w',
        // callbackURL: '/api/auth/google/verify'
      },
      function verificationCallback( token, refreshToken, profile, done ) {
        let nameArray = profile.displayName.split( ' ' );
        let info = {
          name: profile.displayName,
          email: profile.emails[ 0 ].value,
          password: profile.id
        };

        User.findOrCreate( {
            where: { googleId: profile.id },
            defaults: {
              firstname: nameArray[ 0 ],
              lastname: nameArray[ 1 ],
              username: info.email,
              email: info.email,
              password: info.password
            }
          } )
          .spread( user => {
            console.log(user);
            done( null, user );
          } )
          .catch( done );
    } )
  );

  app.get('/', passport.authenticate('google', {
    scope: 'email',
    session: false
  }));

  // passport will exchange token from google with a token which we can use.
  app.get('/verify', passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }), (req, res, next) => {
    var jwtToken = jwt.encode({ id: req.user.id }, process.env.JWT_SECRET || '1701-Flex-NY' );
    console.log('jwtSecret', jwtToken)
    res.redirect(`/?token=${jwtToken}`);
    // res.json({ token: jwtToken });
  });
};
