import { ManyClientSettings, Settings } from '@presenter/contract'
import { mutableValue, readOnly, subscribable } from '@presenter/node'

import createGlobalSettings from './global'

const omitPrivateClients = ( allSettings: ManyClientSettings ) => Object
  .entries( allSettings )
  .reduce( ( acc, [ id, settings ] ) => ( {
    ...acc,
    ...( !settings.security.private && { [ id ]: settings } ),
  } ), {} as ManyClientSettings )

type SettingsStateOptions = {
  globalSettings: ReturnType<typeof createGlobalSettings>,
}

const createSettingsState = ( { globalSettings }: SettingsStateOptions ) => {
  const manyClientSettings = subscribable<ManyClientSettings>( mutableValue( {} ) )
  const publicSettings = subscribable( mutableValue<ManyClientSettings>( {} ) )

  const setSettings = ( id: string, { local, global, ...rest }: Settings ) => {
    if ( global ) globalSettings.save( global )

    const newSettings = {
      ...manyClientSettings.get(),
      // Only accept setting changes for public devices
      ...omitPrivateClients( rest ),
      ...( local && { [ id ]: local } ),
    }

    manyClientSettings.set( newSettings )
  }

  const getClientSettings = ( id: string ): Settings => {
    // Remove settings for id so that we can map it to local
    const { [ id ]: _, ...existing } = publicSettings.get()
    const local = manyClientSettings.get()[ id ]
    const global = globalSettings.get()

    return { ...existing, local, global }
  }

  manyClientSettings.onChange( ( all ) => publicSettings.set( omitPrivateClients( all ) ) )

  return {
    getClientSettings,
    setSettings,
    publicSettings: readOnly( publicSettings ),
  }
}

export default createSettingsState
