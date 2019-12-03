/**
 * Analytics, including error reporting.
 * @ignore
 */

/* eslint-disable class-methods-use-this */
import * as Sentry from '@sentry/node'
import { readJSON } from 'fs-extra'
import { cpus, freemem, totalmem, platform, networkInterfaces } from 'os'

import logger from './logger'
import settings from './settings'
import { SENTRY_DSN, isDev, SENTRY_PROJECT } from './consts'

/**
 * Analytics class for tracking events and providing error reporting.
 */
class Analytics {
  /**
   * Initialises the analytics class.
   * Loads Sentry.
   */
  async initialise() {
    if ( isDev || !settings.get( 'system.serverAnalytics' ) ) return

    await this.initSentry()
  }

  /**
   * Initialises Sentry error reporting.
   * ! Cannot be disabled without a restart.
   */
  async initSentry() {
    logger.info( 'Enabling Sentry error reporting' )

    // Set the sentry release
    const { version } = await readJSON( 'package.json', 'utf-8' )
    const release = `${SENTRY_PROJECT}@${version}`

    Sentry.init( { dsn: SENTRY_DSN, release } )
  }

  sendException( error ) {
    Sentry.withScope( scope => {
      scope.setExtra( 'settings', settings.get() )
      scope.setExtra( 'system', {
        cpus: cpus(),
        freeMemory: freemem(),
        totalMemory: totalmem(),
        platform: platform(),
        networkInterfaces: networkInterfaces(),
      } )

      Sentry.captureException( error )
    } )
  }
}

export default new Analytics()
