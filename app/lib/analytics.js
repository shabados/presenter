/**
 * Analytics, including error reporting.
 * @ignore
 */

import * as Sentry from '@sentry/node'

import logger from './logger'
import { SENTRY_DSN } from './consts'

/**
 * Analytics class for tracking events and providing error reporting.
 */
class Analytics {
  /**
   * Initialises the analytics class.
   * Loads Sentry.
   */
  constructor() {
    Analytics.initSentry()
  }

  /**
   * Initialises Sentry error reporting.
   * * Disabled in development.
   * ! Cannot be disabled without a restart.
   */
  static initSentry() {
    if ( process.env === 'production' ) {
      logger.info( 'Enabling Sentry error reporting' )
      Sentry.init( { dsn: SENTRY_DSN } )
    }
  }
}

export default new Analytics()
