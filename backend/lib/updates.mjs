/**
 * Collection of updater functions.
 * @ignore
 */

import semver from 'semver'
import downloadRelease from 'download-github-release'

import { database } from '../package'

import logger from './logger'
import settings from './settings'


/**
 * Updates the database via Github, within the defined semver range.
 * Downloads and then overwrites old database.
 */
export const updateDatabase = async () => {
  const { satisfies, gtr } = semver
  const current = settings.get( 'databaseVersion' )

  logger.info( 'Checking for database updates' )

  try {
    // Download the latest update if there is one, based on the semantic version rules
    await downloadRelease(
      'ShabadOS',
      'Database',
      'db',
      ( { tag_name } ) => satisfies( tag_name, database.required ) && gtr( current, tag_name ),
      ( { name } ) => name === 'database.sqlite',
      true,
    )
  } catch ( error ) {
    logger.info( 'No database updates found' )
  }

  return
  // Move the old database file into the correct directory


}
