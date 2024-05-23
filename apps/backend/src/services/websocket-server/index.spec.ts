import { createServer, createSocketClient } from 'test/utils/socket'
import { flushPromises } from 'test/utils/tasks'
import { describe, expect, it } from 'vitest'

describe( 'Socket Server', () => {
  describe( 'json', () => {
    it( 'should send a JSON message to the client', async () => {
      const { httpServer, socketServer } = createServer()
      const client = createSocketClient( { httpServer } )()
      await client.isClientReady

      Array.from( socketServer.clients )[ 0 ].json( 'content:line:current', 'ABCD' )

      await flushPromises( 2 )
      console.log( client.messageHandler.mock.calls )
    } )
  } )

  describe( 'broadcast', () => {
    it( 'should send a message to all clients', async () => {
      const { httpServer, socketServer } = createServer()
      const clients = Array.from( { length: 3 }, () => createSocketClient( { httpServer } )() )
      await Promise.all( clients.map( ( client ) => client.isClientReady ) )

      socketServer.broadcast( 'content:line:current' )( 'ABCD' )

      await Promise.all( clients.map( ( client ) => client.waitForEvent( 'content:line:current' ) ) )
    } )
  } )

  describe( 'on connection', () => {
    it( 'should resolve the host for the client', async () => {
      const { httpServer } = createServer()
      const client = createSocketClient( { httpServer } )()

      await client.isClientReady

      expect( client.host ).toBeTruthy()
    } )
  } )
} )
