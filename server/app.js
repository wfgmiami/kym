const express = require( 'express' );
const app = express();

module.exports = app;

require( './configure/app-variables' )( app );
require( './oauth' )( app );

