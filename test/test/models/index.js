const { expect } = require( 'chai' );
const data = require('../../db/data');
console.log(data);

describe( 'MODELS', () => {
  describe( 'Test', () => {
    it( 'woo', () => {
      expect( 1 ).to.be.ok;
    } );
  } );
} );
