/**
 * Analytics, including error reporting.
 * @ignore
 */

/* eslint-disable class-methods-use-this */
import * as Sentry from '@sentry/node'
import { cpus, freemem, networkInterfaces, platform, release, totalmem } from 'os'

import { version } from '../package.json'
import { isDev, SENTRY_DSN, SENTRY_PROJECT } from './consts'
import logger from './logger'
import settings from './settings'

/**
 * Analytics class for tracking events and providing error reporting.
 */
class Analytics {
  /**
   * Initialises the analytics class.
   * Loads Sentry.
   */
  async initialise() {
    await this.initSentry()
  }

  /**
   * Initialises Sentry error reporting.
   * ! Cannot be disabled without a restart.
   */
  async initSentry() {
    if ( isDev || !settings.get( 'system.serverAnalytics' ) ) return

    logger.info( 'Enabling Sentry error reporting' )

    // Set the sentry release
    const release = `${SENTRY_PROJECT}@${version}`

    Sentry.init( {
      dsn: SENTRY_DSN,
      release,
    } )
  }

  sendException( error ) {
    Sentry.withScope( ( scope ) => {
      scope.setExtra( 'settings', settings.get() )
      scope.setExtra( 'system', {
        cpus: cpus(),
        freeMemory: freemem(),
        totalMemory: totalmem(),
        platform: platform(),
        release: release(),
        networkInterfaces: networkInterfaces(),
      } )

      Sentry.captureException( error )
    } )
  }

  flush() {
    // Give 2 seconds to flush Sentry data
    const sentryClient = Sentry.getCurrentHub().getClient()
    return sentryClient ? sentryClient.close( 2000 ) : Promise.resolve()
  }
}

export default new Analytics()
