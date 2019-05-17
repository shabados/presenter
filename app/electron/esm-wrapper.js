/* eslint-disable no-global-assign, import/no-dynamic-require */

const [ ,, entry = 'entry' ] = process.argv

// Patch require to allow for ES6 imports
require = require( 'esm' )( module )

require( `./${entry}` )
