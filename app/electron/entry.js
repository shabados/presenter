/* eslint-disable global-require, no-global-assign */
const { spawn } = require( 'child_process' )

const LAUNCH_FLAG = '--start-server'

// Patch require to allow for ES6 imports
require = require( 'esm' )( module )

const { execPath, argv, env } = process
env.NODE_ENV = 'production'

// Launches server in a separate process, with flag
const spawnServer = () => spawn( execPath, [ LAUNCH_FLAG ] )
// Define loader functions
const loadServer = () => require( '../server' )
const loadElectron = () => require( './electron-wrapper' )

// Load either Electron shell or backend server depending on flag
const [ , processFlag ] = argv
module.exports = processFlag === LAUNCH_FLAG ? loadServer() : spawnServer() && loadElectron()
