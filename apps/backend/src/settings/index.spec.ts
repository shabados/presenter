import { ClientSettings, ServerSettings } from '@presenter/contract/src'
import { SETTINGS_FILE } from '@presenter/node/src'
import type { PartialDeep } from 'type-fest'

import { createServer, createSocketClient } from '../../test/utils/socket'
import { readJSON } from '../helpers/files'
import createGlobalSettings from '../services/global-settings'
import createSettingsModule from '.'

const getClientSettings = ( settings: PartialDeep<ClientSettings> = {} ) => ( {
  display: {},
  layout: {},
  theme: {},
  vishraams: {},
  sources: {},
  hotkeys: {},
  security: { private: false },
  search: {},
  ...settings,
} ) as ClientSettings

const getGlobalSettings = ( settings: PartialDeep<ServerSettings> ) => ( {
  closedCaptions: {},
  notifications: {},
  overlay: {},
  system: {},
  version: {},
  ...settings,
} ) as ServerSettings

const setup = () => {
  const { httpServer, socketServer } = createServer()

  const globalSettings = createGlobalSettings()

  const module = createSettingsModule( { socketServer, globalSettings } )

  const createClient = createSocketClient( {httpServer} )

  return { module, createClient }
}

describe( 'Settings', () => {
  describe( 'on client connection', () => {
    it( 'should send all other settings to the client', async () => {
      const { createClient } = setup()
      const client = createClient()
      await client.sendEvent( 'settings:all', { clients: { hostA: getClientSettings(), hostB: getClientSettings() } } )

      const settings = await client.waitForEvent( 'settings:all' )

      expect( settings.local ).toBeUndefined()
      expect( settings.clients.hostA ).toBeDefined()
      expect( settings.clients.hostB ).toBeDefined()
      expect( settings.global ).toBeDefined()
    } )

    it( 'should map client settings settings to local field', async () => {
      const { createClient } = setup()
      const client = createClient()

      await client.sendEvent( 'settings:all', { clients: { [ client.host ]: getClientSettings() } } )
      const settings = await client.waitForEvent( 'settings:all' )

      expect( settings.local.security.private ).toBe( false )
    } )
  } )

  describe( 'on settings change', () => {
    it( 'should send the updated settings to all clients', async () => {
      const { createClient } = setup()
      const main = createClient( { host: 'main' } )
      const others = Array.from(
        { length: 4 },
        ( _, index ) => createClient( { host: index.toString() } )
      )
      await Promise.all( [ main, ...others ].map( ( client ) => client.waitForEvent( 'settings:all' ) ) )

      await main.sendEvent( 'settings:all', { local: getClientSettings( { display: { larivaarAssist: true } } ) } )
      const [ mainSettings, ...otherSettings ] = await Promise.all( [ main, ...others ].map( ( client ) => client.waitForEvent( 'settings:all' ) ) )

      expect( mainSettings.local.display.larivaarAssist ).toBe( true )
      otherSettings.forEach(
        ( settings ) => expect( settings.clients.main.display.larivaarAssist ).toBe( true )
      )
    } )

    it( 'should omit private clients from settings', async () => {
      const { createClient } = setup()
      const client = createClient()
      const privateClient = createClient( { host: '192.168.1.100' } )

      await Promise.all( [
        client.sendEvent( 'settings:all', { local: getClientSettings() } ),
        privateClient.sendEvent( 'settings:all', { local: getClientSettings( { security: { private: true } } ) } ),
      ] )
      const settings = await client.waitForEvent( 'settings:all' )

      expect( settings.clients[ privateClient.host ] ).toBeUndefined()
    } )

    it( 'should map local to the host', async () => {
      const { createClient } = setup()
      const client = createClient( { host: 'A' } )

      await client.sendEvent( 'settings:all', { clients: { [ client.host ]: getClientSettings() } } )
      const settings = await client.waitForEvent( 'settings:all' )

      expect( settings.local ).toBeDefined()
      expect( settings.clients[ client.host ] ).toBeUndefined()
    } )

    it( 'should ignore changes set on private clients', async () => {
      const { createClient } = setup()
      const client = createClient()
      const privateClient = createClient( { host: '192.168.1.100' } )
      await Promise.all( [
        client.sendEvent( 'settings:all', { local: getClientSettings() } ),
        privateClient.sendEvent( 'settings:all', { local: getClientSettings( { security: { private: true } } ) } ),
      ] )
      await Promise.all( [
        client.waitForEvent( 'settings:all' ),
        privateClient.waitForEvent( 'settings:all' ),
      ] )

      await client.sendEvent( 'settings:all', { [ privateClient.host ]: getClientSettings( { security: { private: false } } ) } )
      const [ settings, privateSettings ] = await Promise.all( [
        client.waitForEvent( 'settings:all' ),
        privateClient.waitForEvent( 'settings:all' ),
      ] )

      expect( settings.clients[ privateClient.host ] ).toBeUndefined()
      expect( privateSettings.local.security.private ).toBe( true )
    } )

    it( 'should save the global settings to file', async () => {
      const { createClient } = setup()
      const client = createClient()

      await client.sendEvent( 'settings:all', { global: getGlobalSettings( { system: { multipleDisplays: true } } ) } )

      const serverSettings = await readJSON<ServerSettings>( SETTINGS_FILE )
      expect( serverSettings.system.multipleDisplays ).toBe( true )
    } )
  } )
} )
