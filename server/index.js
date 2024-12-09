const path = require( 'path' );
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const conn = require( './db/conn' );

const app = require('./app');

module.exports = app;

conn
  .sync()
  .then( () => {
    app.set( 'port', process.env.PORT || 3000 );

    app.use( '/public', express.static( path.join( __dirname, '../public' ) ) );
    app.use( '/vendor', express.static( path.join( __dirname, '../node_modules' ) ) );
    app.use( '/stylesheets', express.static( path.join( __dirname, '..', 'browser/stylesheets' ) ) );
    app.use( '/images', express.static( path.join( __dirname, '..', 'browser/images' ) ) );

    app.use( bodyParser.json() );
    app.use( bodyParser.urlencoded( { extended: false } ) );

    app.use( '/api', require( './routes/api' ) );

    app.get( '*', function ( req, res ) {
      res.sendFile( path.join( __dirname, '../public/index.html' ) );
    } );

    app.use( function ( req, res, next ) {
      res.status( 404 );
      res.render( '404' );
    } );

    app.use( function ( err, req, res, next ) {
      console.log( err );
      res.status( 500 );
      res.send( err );
    } );

    app.listen( app.get( 'port' ), function () {
      console.log( '--------------------------------' );
      console.log( `Server is listening on port ${app.get('port')}` );
    } );

  } );

