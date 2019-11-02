import { EventEmitter } from 'events'
import { readJSON, remove, move } from 'fs-extra'
import { join } from 'path'
import { manifest, extract } from 'pacote'
import importFresh from 'import-fresh'
import { knex } from '@shabados/database'

import { dependencies } from '../package.json'

import logger from './logger'
import settings from './settings'
import { DATABASE_FOLDER, electronVersion } from './consts'

const databasePackage = `@shabados/database@${dependencies[ '@shabados/database' ]}`

class Updater extends EventEmitter {
  constructor( { tempFolder, interval } ) {
    super()

    this.tempFolder = tempFolder
    this.interval = interval

    if ( electronVersion ) this.initElectronUpdates()
  }

  async start() {
    this.updateLoop( this.checkDatabaseUpdates.bind( this ) )
    if ( electronVersion ) this.updateLoop( Updater.checkApplicationUpdates.bind( this ) )
  }

  initElectronUpdates() {
    // eslint-disable-next-line global-require
    const { autoUpdater } = require( 'electron-updater' )

    autoUpdater.logger = logger
    autoUpdater.allowPrerelease = settings.get( 'system.betaOptIn' )

    // Change beta opt-in on settings change
    settings.on( 'change', ( { system: { betaOptIn = false } } ) => {
      autoUpdater.allowPrerelease = betaOptIn
    } )

    // Set up application autoupdates
    autoUpdater.on( 'update-available', info => this.emit( 'application-update', info ) )
    autoUpdater.on( 'update-downloaded', info => this.emit( 'application-updated', info ) )
  }

  /**
   * Executes electron-autoupdater's checker.
   */
  static async checkApplicationUpdates() {
    // eslint-disable-next-line global-require
    const { autoUpdater } = require( 'electron-updater' )

    logger.info( 'Checking for app updates, beta:', autoUpdater.allowPrerelease )
    const { downloadPromise } = await autoUpdater.checkForUpdates()
    return downloadPromise
  }

  /**
     * Determines whether the database is the latest version, according to semver.
     * @async
     * @returns {boolean} Whether or not the latest database is installed.
     */
  async isLatestDatabase() {
    // Read package.json database semver and database package file
    const [ remotePackage, localPackage ] = await Promise.all( [
      manifest( databasePackage ),
      readJSON( join( DATABASE_FOLDER, 'package.json' ), 'utf-8' ),
    ] )

    const { version: local } = localPackage
    const { version: remote } = remotePackage

    this.emit( 'database-version', { local, remote } )
    logger.info( 'Local Database Version:', local )
    logger.info( 'Remote Database Version:', remote )

    return localPackage.version === remotePackage.version
  }

  /**
    * Downloads the latest version of the database, according to semver.
    * Hot-reloads the data only.
    * ! Code will not be hot-reloaded, and code updates require a restart.
    * @async
    */
  async updateDatabase() {
    // Download and extract the database package from npm
    logger.info( `Downloading database update to ${this.tempFolder}` )
    await remove( this.tempFolder )
    await extract( databasePackage, this.tempFolder )

    logger.info( 'Hot-patching database module' )
    // Disconnect the Shabad OS database connection
    await knex.destroy()
    // Move across the updated npm database module
    await move( this.tempFolder, DATABASE_FOLDER, { overwrite: true } )
    // Reimport the database
    //! Relies on knex being reinitialised globally
    importFresh( '@shabados/database' )
  }

  /**
    * Checks for database updates, according to semver, and updates if there are.
    * @async
    */
  async checkDatabaseUpdates() {
    logger.info( `Checking for database updates satisfying ${databasePackage}` )

    // Exit if there aren't any updates
    if ( await this.isLatestDatabase() ) {
      logger.info( 'No database updates available' )
      return
    }

    this.emit( 'database-update' )
    await this.updateDatabase()

    this.emit( 'database-updated' )
    logger.info( 'Database successfully updated' )
  }

  /**
    * Provides a recursive update checking function.
    * Checks for udpates at constant interval.
    */
  async updateLoop( updateFunction ) {
    const enabled = settings.get( 'system.automaticUpdates' )

    const fn = enabled ? updateFunction : () => Promise.resolve()

    await fn().catch( logger.error )
    setTimeout( () => this.updateLoop( updateFunction ), this.interval )
  }
}

export default Updater
