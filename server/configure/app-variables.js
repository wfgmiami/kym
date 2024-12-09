const path = require( 'path' );
const rootPath = path.join( __dirname, '../../' );
const serverRoot = path.join( __dirname, '../' );

const secret = process.env.SECRET || '1701-Flex-NY';
const oauth = require( './oauthInfo' );

module.exports = app => {
  app.set( 'projectRoot', rootPath );
  app.set( 'jwtSecret', secret );
  app.set( 'serverRoot', serverRoot );
  app.set( 'oauth', oauth );
};

