import { ensureAppFolders } from '@presenter/node'
import { EventEmitter } from 'eventemitter3'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { createServer, createSocketClient } from '~/../test/utils/socket'
import createGlobalSettings from '~/services/global-settings'
import { UpdateEvent, Updater } from '~/services/updater'

import createStatusModule from '.'

const createMockUpdater = () => {
  const emitter = new EventEmitter<UpdateEvent>()

  const emit = ( event: UpdateEvent ) => emitter.emit( event )
  const on = ( event: UpdateEvent, handler: () => void ) => emitter.on( event, handler )

  return { on, start: () => {}, emit }
}

type SetupOptions = {
  updater: Updater,
}

const setup = async ( {
  updater = createMockUpdater(),
}: Partial<SetupOptions> = {} ) => {
  const { httpServer, socketServer } = createServer()

  const createClient = createSocketClient( { httpServer } )

  const globalSettings = createGlobalSettings()
  await globalSettings.load()
  const module = createStatusModule( { socketServer, globalSettings, updater } )

  return { module, createClient, globalSettings }
}

describe( 'Status', () => {
  beforeAll( () => { ensureAppFolders() } )
  beforeEach( () => { vi.useRealTimers() } )

  it( 'should expire any status message', async () => {
    const updater = createMockUpdater()
    const { createClient, globalSettings } = await setup( { updater } )
    const client = createClient()
    globalSettings.save( { notifications: { downloadEvents: true } } )
    vi.useFakeTimers()
    updater.emit( 'application:updating' )

    vi.runOnlyPendingTimers()
    const status = await client.waitForEvent( 'status' )

    expect( status ).toBeNull()
  } )

  describe( 'given notification connection events are enabled', () => {
    it( 'should set the status when a client connects', async () => {
      const { createClient, globalSettings } = await setup()
      globalSettings.save( { notifications: { connectionEvents: true } } )

      const status = await createClient().waitForEvent( 'status' )

      expect( status ).toMatch( /connected/ )
    } )
  } )

  describe( 'given notification disconnection events are enabled', () => {
    it( 'should set the status when a client disconnects', async () => {
      const { createClient, globalSettings } = await setup()
      globalSettings.save( { notifications: { disconnectionEvents: true } } )
      const clientA = createClient()
      const clientB = createClient()
      await Promise.all( [
        clientA.waitForEvent( 'status' ),
        clientB.waitForEvent( 'status' ),
      ] )

      clientB.socketClient.close()
      const status = await clientA.waitForEvent( 'status' )

      expect( status ).toMatch( /disconnected/ )
    } )
  } )

  describe( 'given notification update available events are enabled', () => {
    it.each( [
      [ 'app', 'application:updating' ],
      [ 'database', 'database:updating' ],
    ] as const )( 'should set the status when an %s update is available', async ( type: string, event: UpdateEvent ) => {
      const updater = createMockUpdater()
      const { createClient, globalSettings } = await setup( { updater } )
      const client = createClient()
      globalSettings.save( { notifications: { downloadEvents: true } } )

      updater.emit( event )
      const status = await client.waitForEvent( 'status' )

      expect( status ).toMatch( type )
    } )
  } )

  describe( 'given notification updated events are enabled', () => {
    it.each( [
      [ 'app', 'application:updated', /app updat/i ],
      [ 'database', 'database:updated', /database updated/i ],
    ] as const )( 'should set the status when %s has updated', async ( _, event: UpdateEvent, result: RegExp ) => {
      const updater = createMockUpdater()
      const { createClient, globalSettings } = await setup( { updater } )
      const client = createClient()
      await client.waitForEvent( 'status' )
      globalSettings.save( { notifications: { downloadedEvents: true } } )

      updater.emit( event )
      const status = await client.waitForEvent( 'status' )

      expect( status ).toMatch( result )
    } )
  } )
} )
