/* eslint-disable */

// Patch require to allow for ES6 imports
require = require( 'esm' )( module )
module.exports = require( './server' )
