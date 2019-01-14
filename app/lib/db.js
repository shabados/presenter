/**
 * Database related utility functions.
 * @ignore
 */

import { readJSON, remove, move } from 'fs-extra'
import { manifest, extract } from 'pacote'
import importFresh from 'import-fresh'
import { Lines, Shabads, Banis, knex } from '@shabados/database'

import logger from './logger'
import { MAX_RESULTS, UPDATE_TMP_FOLDER, UPDATE_CHECK_INTERVAL } from './consts'

import { dependencies } from '../package.json'

const databasePackage = `@shabados/database@${dependencies[ '@shabados/database' ]}`

/**
 * Queries the database for all lines with the first letters of each word.
 * @param {string} letters The letters to search for.
 * @async
 * @returns {Array} A list of lines with the provided first letters of each word.
 */
export const searchLines = letters => Lines
  .query()
  .firstLetters( letters )
  .limit( MAX_RESULTS )

/**
 * Gets the Shabad of given `shabadId`, along with all the lines.
 * @param {number|string} shabadId The id of the Shabad to fetch results for.
 * @async
 * @returns {Object} The Shabad with the given `shabadId`.
 */
export const getShabad = shabadId => Shabads
  .query()
  .where( 'shabads.id', shabadId )
  .eager( 'lines' )
  .withTransliterations()
  .withTranslations()
  .then( ( [ shabad ] ) => shabad )

/**
 * Retrieves a list of the available Banis.
 * @async
 * @returns {Array} A list of all banis.
 */
export const getBanis = () => Banis.query()

/**
 * Gets all the lines in a given Bani.
 * @param {number|string} baniId The id of the Bani to fetch lines for.
 * @async
 * @returns {Array} A list of all lines with translations and transliterations.
 */
export const getBaniLines = baniId => Banis
  .query()
  .eager( 'lines' )
  .modifyEager( 'lines', builder => {
    builder.orderBy( [ 'line_group', 'line_id' ] )
  } )
  .where( 'banis.id', baniId )
  .withTranslations()
  .withTransliterations()
  .then( ( [ bani ] ) => bani )

/**
 * Determines whether the database is the latest version, according to semver.
 * @async
 * @returns {boolean} Whether or not the latest database is installed.
 */
export const isLatestDatabase = async () => {
  // Read package.json database semver and database package file
  const [ remotePackage, localPackage ] = await Promise.all( [
    manifest( databasePackage ),
    readJSON( 'node_modules/@shabados/database/package.json', 'utf-8' ),
  ] )

  logger.info( 'Local Database Version:', localPackage.version )
  logger.info( 'Remote Database Version:', remotePackage.version )

  return localPackage.version === remotePackage.version
}

/**
 * Downloads the latest version of the database, according to semver.
 * Hot-reloads the data only.
 * ! Code will not be hot-reloaded, and code updates require a restart.
 * @async
 */
export const updateDatabase = async () => {
  // Download and extract the database package from npm
  logger.info( `Downloading database update to ${UPDATE_TMP_FOLDER}` )
  await remove( UPDATE_TMP_FOLDER )
  await extract( databasePackage, UPDATE_TMP_FOLDER )

  logger.info( 'Hot-patching database module' )
  // Disconnect the Shabad OS database connection
  await knex.destroy()
  // Move across the updated npm database module
  await move( UPDATE_TMP_FOLDER, 'node_modules/@shabados/database', { overwrite: true } )
  // Reimport the database
  //! Relies on knex being reinitialised globally
  importFresh( '@shabados/database' )
}

/**
 * Checks for database updates, according to semver, and updates if there are.
 * @async
 */
export const checkUpdates = async () => {
  logger.info( `Checking for database updates satisfying ${databasePackage}` )

  // Exit if there aren't any updates
  if ( await isLatestDatabase() ) {
    logger.info( 'No database updates available' )
    return
  }

  await updateDatabase()
  logger.info( 'Database successfully updated' )
}

/**
 * Provides a recursive update checking function.
 * Checks for udpates at constant interval.
 */
export const updateLoop = async () => {
  await checkUpdates()
  setTimeout( updateLoop, UPDATE_CHECK_INTERVAL )
}
