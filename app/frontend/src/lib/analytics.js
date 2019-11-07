/**
 * Analytics, including error reporting.
 * @ignore
 */

/* eslint-disable class-methods-use-this */
import * as Sentry from '@sentry/browser'

import { SENTRY_DSN, isDev } from './consts'

/**
 * Analytics class for tracking events and providing error reporting.
 */
class Analytics {
  /**
   * Initialises the analytics class.
   * Loads Sentry.
   */
  initialise() {
    if ( isDev ) return

    this.initSentry()
  }

  /**
   * Initialises Sentry error reporting.
   * ! Cannot be disabled without a restart.
   */
  initSentry() {
    console.log( 'Enabling Sentry error reporting' )
    Sentry.init( { dsn: SENTRY_DSN } )
  }

  updateSettings( settings ) {
    Sentry.configureScope( scope => {
      scope.setExtra( 'settings', settings )
    } )
  }
}

export default new Analytics()
