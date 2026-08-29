/**
 * Analytics, including error reporting.
 * @ignore
 */

/* eslint-disable class-methods-use-this */
import * as Sentry from '@sentry/browser'

import { SENTRY_DSN, isDev, SENTRY_PROJECT, BACKEND_URL } from './consts'

/**
 * Analytics class for tracking events and providing error reporting.
 */
class Analytics {
  /**
   * Initialises the analytics class.
   * Loads Sentry.
   */
  async initialise() {
    if ( isDev ) return

    await this.initSentry()
  }

  /**
   * Initialises Sentry error reporting.
   * ! Cannot be disabled without a restart.
   */
  async initSentry() {
    console.log( 'Enabling Sentry error reporting' )

    // Set the sentry release
    const { version } = await fetch( `${BACKEND_URL}/about` ).then( res => res.json() )
    const release = `${SENTRY_PROJECT}@${version}`
    console.log( `Using sentry release ${release}` )

    Sentry.init( { dsn: SENTRY_DSN, release } )
  }

  updateSettings( settings ) {
    Sentry.configureScope( scope => {
      scope.setExtra( 'settings', settings )
    } )
  }
}

export default new Analytics()
