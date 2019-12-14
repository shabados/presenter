/* eslint-disable no-global-assign, import/no-dynamic-require */

const [ ,, entry = 'entry' ] = process.argv

// Disable the ESM cache
process.env.ESM_DISABLE_CACHE = 1

// Patch require to allow for ES6 imports
require = require( 'esm' )( module )

require( `./${entry}` )
