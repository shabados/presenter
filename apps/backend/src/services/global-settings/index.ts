import { ServerSettings } from '@presenter/contract'
import { getLogger, mutableValue, SETTINGS_FILE, subscribable } from '@presenter/node'
import merge from 'deepmerge'
import type { PartialDeep, ReadonlyDeep } from 'type-fest'

import { readJSON, writeJSON } from '~/helpers/files'

import defaults from './defaults'

const log = getLogger( 'settings' )

type PartialSettings = PartialDeep<ServerSettings>

const writeSettings = ( settings: ServerSettings ) => writeJSON( SETTINGS_FILE, settings )

const readSettings = () => readJSON<PartialSettings>( SETTINGS_FILE )
  .then( ( settings ) => merge( settings, defaults ) as ServerSettings )
  .catch( () => {
    log.warn( 'Settings file is corrupt or non-existent. Recreating', SETTINGS_FILE )

    return writeSettings( defaults ).then( () => defaults )
  } )

const createGlobalSettings = () => {
  const settings = subscribable( mutableValue( {} as ReadonlyDeep<ServerSettings> ) )

  const load = () => {
    log.info( `Loading settings from ${SETTINGS_FILE}` )

    return readSettings().then( settings.set )
  }

  settings.onChange( ( settings ) => void writeSettings( settings ) )

  const save = ( changed: PartialSettings = {} ) => settings.set(
    merge( settings.get(), changed ) as ServerSettings
  )

  return { load, save, get: settings.get, onChange: settings.onChange }
}

export type GlobalSettings = ReturnType<typeof createGlobalSettings>

export default createGlobalSettings
