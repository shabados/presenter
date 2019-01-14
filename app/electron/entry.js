/* eslint-disable global-require, no-global-assign */
const { spawn } = require( 'child_process' )

const LAUNCH_FLAG = '--start-server'

// Patch require to allow for ES6 imports
require = require( 'esm' )( module )

const { execPath, argv, env } = process
env.NODE_ENV = 'production'

/**
 * Launches a server in a separate process, with flag.
 * @returns {ChildProcess} The spawned child process.
 */
const spawnServer = () => spawn( execPath, [ LAUNCH_FLAG ] )

// Define loader functions

/**
 * Function to load server.
 */
const loadServer = () => { require( '../server' ) }

/**
 * Function to load the electron wrapper for frontend.
 */
const loadElectron = () => { require( './electron-wrapper' ) }

// Load either Electron shell or backend server depending on flag
const [ , processFlag ] = argv
module.exports = processFlag === LAUNCH_FLAG ? loadServer() : spawnServer() && loadElectron()
