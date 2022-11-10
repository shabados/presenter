import { getLogger, isDevelopment } from '@presenter/node'
import * as Sentry from '@sentry/node'
import { cpus, freemem, networkInterfaces, platform, release, totalmem } from 'os'

import { version } from '../../package.json'
import createSettings from '../settings'
import { SENTRY_DSN, SENTRY_PROJECT } from '../helpers/consts'

const log = getLogger( 'analytics' )

type AnalyticsOptions = {
  settings: ReturnType<typeof createSettings>,
}

const createAnalytics = ( { settings }: AnalyticsOptions ) => {
  const initSentry = () => {
    if ( isDevelopment || !globalSettings.get().system.serverAnalytics ) return

    log.info( 'Enabling Sentry error reporting' )

    const release = `${SENTRY_PROJECT}@${version}`
    Sentry.init( { dsn: SENTRY_DSN, release } )
  }

  const sendException = ( error: Error ) => {
    Sentry.withScope( ( scope ) => {
      scope.setExtra( 'settings', globalSettings.get() )
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

  const flush = () => {
    const sentryClient = Sentry.getCurrentHub().getClient()
    return sentryClient ? sentryClient.close( 2000 ) : Promise.resolve()
  }

  return { initialise: initSentry, sendException, flush }
}

export default createAnalytics
