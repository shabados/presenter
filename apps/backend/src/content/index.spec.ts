import http from 'node:http'

import { Language, RecommendedSources, Writer } from '@presenter/contract'
import { first, last } from '@presenter/swiss-knife'
import express from 'express'
import { describe, expect, it } from 'vitest'

import { fetchApi } from '~/../test/utils/fetch'
import { createServer, createSocketClient, SocketClient } from '~/../test/utils/socket'
import createHistoryModule from '~/history'

import createContentModule from '.'

const setup = () => {
  const api = express()
  const httpServer = http.createServer( api )
  const { socketServer } = createServer( { httpServer } )
  const history = createHistoryModule( {} )

  const clientA = createSocketClient( { httpServer } )()
  const clientB = createSocketClient( { httpServer } )()
  const fetch = fetchApi( { httpServer } )

  createContentModule( { api, socketServer, history } )

  return { clientA, clientB, fetch }
}

const withShabad = async ( client: SocketClient ) => {
  await client.sendEvent( 'content:shabad:open', { id: 'DMP' } )
  const [ shabad ] = await Promise.all( [
    client.waitForEvent( 'content:current', ( content ) => content?.type === 'shabad' ),
    client.waitForEvent( 'content:line:current', ( lineId ) => lineId === '0NVY' ),
  ] )

  return shabad!
}

describe( 'Content', () => {
  describe( 'GET /sources', () => {
    it( 'should return all and recommended sources', async () => {
      const { fetch } = setup()

      const { sources, recommendedSources } = await fetch<RecommendedSources>( '/sources' )

      expect( Object.keys( sources ).length ).toBeGreaterThan( 0 )
      expect( Object.keys( recommendedSources ).length ).toBeGreaterThan( 0 )
    } )
  } )

  describe( 'GET /languages', () => {
    it( 'should return all languages', async () => {
      const { fetch } = setup()

      const languages = await fetch<Language[]>( '/languages' )

      expect( languages.length ).toBeGreaterThan( 0 )
    } )
  } )

  describe( 'GET /writers', () => {
    it( 'should return all writers', async () => {
      const { fetch } = setup()

      const writers = await fetch<Writer[]>( '/writers' )

      expect( writers.length ).toBeGreaterThan( 0 )
    } )
  } )

  describe( 'when a line is set', () => {
    describe( 'given a line id', () => {
      it( 'should broadcast the line ID if valid', async () => {
        const { clientA, clientB } = setup()
        await withShabad( clientA )
        const id = 'RBP6'

        await clientA.sendEvent( 'content:line:set-current', { id } )

        const receivedIds = await Promise.all( [
          clientA.waitForEvent( 'content:line:current', ( lineId ) => lineId !== '0NVY' ),
          clientB.waitForEvent( 'content:line:current', ( lineId ) => lineId !== '0NVY' ),
        ] )
        expect( receivedIds ).toEqual( [ id, id ] )
      } )

      it( 'should ignore the line ID if not in the current content', async () => {
        const { clientA } = setup()
        await withShabad( clientA )
        const id = 'ABCD'

        clientA.sendEvent( 'content:line:set-current', { id } )

        expect( clientA.messageHandler ).not.toHaveBeenCalledWith(
          'content:line:current',
          id,
        )
      } )
    } )
  } )

  describe( 'when the next line is set', () => {
    it( 'should broadcast the next line if valid', async () => {
      const { clientA, clientB } = setup()
      await withShabad( clientA )

      await clientA.sendEvent( 'content:line:set-next', undefined )

      await clientB.waitForEvent( 'content:line:current', ( lineId ) => lineId === 'RBP6' )
    } )

    it( 'should ignore the next line if the current line is the last line', async () => {
      const { clientA } = setup()
      const shabad = await withShabad( clientA )
      await clientA.sendEvent( 'content:line:set-current', { id: last( shabad.lines ).id } )
      await clientA.waitForEvent( 'content:line:current', ( lineId ) => lineId === last( shabad.lines ).id )

      await clientA.sendEvent( 'content:line:set-next', undefined )

      expect( clientA.messageHandler ).toHaveBeenLastCalledWith( 'content:line:current', last( shabad.lines ).id )
    } )
  } )

  describe( 'when the previous line is set', () => {
    it( 'should broadcast the previous line if valid', async () => {
      const { clientA, clientB } = setup()
      await withShabad( clientA )
      await clientA.sendEvent( 'content:line:set-current', { id: 'RBP6' } )
      await clientA.waitForEvent( 'content:line:current', ( lineId ) => lineId === 'RBP6' )

      await clientA.sendEvent( 'content:line:set-previous', undefined )

      await clientB.waitForEvent( 'content:line:current', ( lineId ) => lineId === '0NVY' )
    } )

    it( 'should ignore the previous line if the current line is the first line', async () => {
      const { clientA } = setup()
      const shabad = await withShabad( clientA )
      await clientA.sendEvent( 'content:line:set-current', { id: first( shabad.lines ).id } )
      await clientA.waitForEvent( 'content:line:current', ( lineId ) => lineId === first( shabad.lines ).id )

      await clientA.sendEvent( 'content:line:set-previous', undefined )

      expect( clientA.messageHandler ).toHaveBeenLastCalledWith( 'content:line:current', first( shabad.lines ).id )
    } )
  } )

  describe( 'when a bani is set', () => {
    it( 'should broadcast the bani if valid', async () => {
      const { clientA, clientB } = setup()
      const id = 1

      await clientA.sendEvent( 'content:bani:open', { id } )

      await clientB.waitForEvent( 'content:current', ( content ) => content?.type === 'bani' )
    } )

    it( 'should set the line id to the first line of the bani', async () => {
      const { clientA, clientB } = setup()
      const id = 1

      await clientA.sendEvent( 'content:bani:open', { id } )

      const [ content, lineId ] = await Promise.all( [
        clientB.waitForEvent( 'content:current', ( content ) => content?.type === 'bani' ),
        clientB.waitForEvent( 'content:line:current', ( lineId ) => !!lineId ),
      ] )
      expect( first( content!.lines ).id ).toBe( lineId )
    } )

    it.todo( 'should add the line to the history of latest lines' )
    it.todo( 'should add the line to the history of transitions' )
  } )

  describe( 'when a shabad is opened', () => {
    describe( 'given a shabad id', () => {
      it( 'should broadcast the shabad if valid', async () => {
        const { clientA, clientB } = setup()
        const id = 'DMP'

        await clientA.sendEvent( 'content:shabad:open', { id } )

        await clientB.waitForEvent( 'content:current', ( content ) => content?.type === 'shabad' )
      } )
    } )

    describe( 'given a shabad id and line id', () => {
      it( 'should broadcast the shabad and line id', async () => {
        const { clientA, clientB } = setup()
        const id = 'DMP'
        const lineId = 'RPB6'

        await clientA.sendEvent( 'content:shabad:open', { id, lineId } )

        await Promise.all( [
          clientB.waitForEvent( 'content:current', ( content ) => content?.type === 'shabad' ),
          clientB.waitForEvent( 'content:line:current', ( id ) => id === lineId ),
        ] )
      } )
    } )

    describe( 'when the next content is opened', () => {
      it( 'should broadcast the next shabad', async () => {
        const { clientA, clientB } = setup()
        await clientA.sendEvent( 'content:shabad:open', { id: 'DMP' } )
        await clientA.waitForEvent( 'content:current' )

        await clientA.sendEvent( 'content:open-next', undefined )

        await clientB.waitForEvent( 'content:current', ( content ) => content?.type === 'shabad' && content.id === 'LLL' )
      } )

      it( 'should ignore the next content if out of range', async () => {
        const { clientA } = setup()
        await clientA.sendEvent( 'content:shabad:open', { id: 'L6K' } )
        await clientA.waitForEvent( 'content:current' )

        await clientA.sendEvent( 'content:open-next', undefined )

        expect( clientA.messageHandler ).toHaveBeenLastCalledWith( 'content:line:current', expect.anything() )
      } )
    } )

    describe( 'when the previous content is opened', () => {
      it( 'should broadcast the previous shabad', async () => {
        const { clientA, clientB } = setup()
        await clientA.sendEvent( 'content:shabad:open', { id: 'LLL' } )
        await clientA.waitForEvent( 'content:current' )

        await clientA.sendEvent( 'content:open-previous', undefined )

        await clientB.waitForEvent( 'content:current', ( content ) => content?.type === 'shabad' && content.id === 'DMP' )
      } )

      it( 'should ignore the next content if out of range', async () => {
        const { clientA } = setup()
        await clientA.sendEvent( 'content:shabad:open', { id: 'DMP' } )
        await clientA.waitForEvent( 'content:current' )

        await clientA.sendEvent( 'content:open-next', undefined )

        expect( clientA.messageHandler ).toHaveBeenLastCalledWith( 'content:line:current', expect.anything() )
      } )
    } )
  } )

  describe( 'when the tracker main line is set', () => {
    it( 'should broadcast the main line ID', async () => {
      const { clientA, clientB } = setup()
      await withShabad( clientA )

      await clientA.sendEvent( 'content:tracker:set-main-line', 'RBP6' )

      await clientB.waitForEvent( 'content:tracker:main-line', ( lineId ) => lineId === 'RBP6' )
    } )

    it( 'should ignore the main line ID if not in the current content', async () => {
      const { clientA } = setup()
      await withShabad( clientA )
      const id = 'ABCD'

      clientA.sendEvent( 'content:tracker:set-main-line', id )

      expect( clientA.messageHandler ).not.toHaveBeenCalledWith(
        'content:tracker:main-line',
        id,
      )
    } )
  } )

  describe( 'when the tracker next line is set', () => {
    it( 'should broadcast the next line if valid', async () => {
      const { clientA, clientB } = setup()
      await withShabad( clientA )

      await clientA.sendEvent( 'content:tracker:set-next-line', 'RBP6' )

      await clientB.waitForEvent( 'content:tracker:next-line', ( lineId ) => lineId === 'RBP6' )
    } )

    it( 'should ignore the next line if not in the current content', async () => {
      const { clientA } = setup()
      await withShabad( clientA )
      const id = 'ABCD'

      clientA.sendEvent( 'content:tracker:set-next-line', id )

      expect( clientA.messageHandler ).not.toHaveBeenCalledWith(
        'content:tracker:next-line',
        id,
      )
    } )
  } )
} )
