/**
 * Collection of updater functions.
 * @ignore
 */

import { ensureDir, move, remove } from 'fs-extra'
import downloadRelease from 'download-github-release'

import { database } from '../package'

import { shouldUpdate } from './utils'
import { UPDATE_CHECK_INTERVAL, TEMP_DIR, DB_PATH } from './consts'
import settings from './settings'
import logger from './logger'


class Database {
  constructor() {
    this.updateTimeout = null
  }

  /**
   * Updates the database via Github, within the defined semver range.
   * Downloads and then overwrites old database.
   */
  async updateDatabase() {
    // Clear any calls that may happen later
    clearTimeout( this.updateTimeout )

    logger.info( 'Checking for database updates' )

    try {
      const FILENAME = 'database.sqlite'
      const tempPath = `TEMP_DIR/${FILENAME}`
      const currentVersion = settings.get( 'database.version' )

      // Check temp directory exists
      await ensureDir( TEMP_DIR )
      // Remove the temp file, if it exists
      await remove( tempPath )

      // Download the latest update if there is one, based on the semantic version rules
      let nextVersion
      await downloadRelease(
        'ShabadOS',
        'Database',
        TEMP_DIR,
        ( { tag_name: tagName } ) => {
          // Choose the correct release
          if ( !nextVersion && shouldUpdate( currentVersion, tagName, database ) ) {
            nextVersion = tagName
            logger.info( `New database version found: ${nextVersion}` )
            return true
          }
          return false
        },
        ( { name } ) => name === FILENAME,
        true,
      )

      // Move the database to the correct location
      await move( tempPath, DB_PATH, { overwrite: true } )

      // Update the version in settings
      settings.set( 'database', { version: nextVersion } )
    } catch ( { status, message } ) {
      // Handle updating errors
      if ( status === 403 ) {
        logger.error( 'Unable to check for updates - Github API limit exceeded' )
      } else if ( message.contains( 'release' ) ) {
        logger.error( 'No updates found' )
      } else {
        logger.info( 'Unable to check for updates' )
      }
    } finally {
      // Whatever happens, check again soon
      this.updateTimeout = setTimeout( () => this.updateDatabase(), UPDATE_CHECK_INTERVAL )
    }
  }
}

// Export database instance singleton
export default new Database()
