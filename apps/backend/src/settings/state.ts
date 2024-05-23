import { ManyClientSettings, Settings } from '@presenter/contract'
import { mutableValue, readOnly, subscribable } from '@presenter/node'
import { omit, omitBy } from 'lodash-es'

import { GlobalSettings } from '../services/global-settings'

type SettingsStateOptions = {
  globalSettings: GlobalSettings,
}

const createSettingsState = ( { globalSettings }: SettingsStateOptions ) => {
  const manyClientSettings = subscribable<ManyClientSettings>( mutableValue( {} ) )
  const publicSettings = subscribable( mutableValue<ManyClientSettings>( {} ) )

  const omitPrivateClients = ( allSettings: ManyClientSettings ) => omitBy(
    allSettings,
    ( _, id ) => manyClientSettings.get()[ id ]?.security.private
  )

  const setSettings = ( id: string, { local, global, clients }: Partial<Settings> ) => {
    if ( global ) globalSettings.save( global )

    const newSettings = {
      ...manyClientSettings.get(),
      // Only accept setting changes for public devices
      ...( clients && omitPrivateClients( clients ) ),
      ...( local && { [ id ]: local } ),
    }

    manyClientSettings.set( newSettings )
  }

  const getClientSettings = ( id: string ): Settings => {
    const clients = omit( publicSettings.get(), id )
    const local = manyClientSettings.get()[ id ]
    const global = globalSettings.get()

    return { clients, local, global }
  }

  manyClientSettings.onChange( ( all ) => publicSettings.set( omitPrivateClients( all ) ) )

  return {
    getClientSettings,
    setSettings,
    publicSettings: readOnly( publicSettings ),
  }
}

export default createSettingsState
