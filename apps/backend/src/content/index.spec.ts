import { Language, RecommendedSources, Writer } from '@presenter/contract/src'
import express from 'express'
import http from 'http'

import { fetchApi } from '../../test/utils/fetch'
import { createServer, createSocketClient } from '../../test/utils/socket'
import createContentModule from '.'

const setup = () => {
  const api = express()
  const httpServer = http.createServer( api )
  const { socketServer } = createServer( { httpServer } )

  const clientA = createSocketClient( { httpServer } )()
  const clientB = createSocketClient( { httpServer } )()
  const fetch = fetchApi( { httpServer } )

  createContentModule( { api, socketServer } )

  return { clientA, clientB, fetch }
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
      it( 'should broadcast the line ID if valid', () => {
        const { clientA, clientB } = setup()
        const id = 'DMP'

        clientA.sendEvent( 'content:line:set-current', { id } )
        const receivedId = clientB.waitForEvent( 'content:line:current' )

        expect( receivedId ).toBe( id )
      } )
      it.todo( 'should ignore the line ID if not in the current content' )
    } )

    describe( 'given a line order id', () => {
    } )
  } )

  describe( 'when a bookmark is set', () => {
    it.todo( 'should set the line id to the first line of the bookmark' )
    it.todo( 'should add the line to the history of latest lines' )
    it.todo( 'should add the line to the history of transitions' )
  } )

  describe( 'when a shabad is opened', () => {
    describe( 'given a shabad id', () => {
      it( 'should broadcast the shabad if valid', () => {
        const { clientA, clientB } = setup()
        const id = '0NVY'

        clientA.sendEvent( 'content:shabad:open', { id } )
        const receivedId = clientB.waitForEvent( 'content:current' )

        expect( receivedId ).toBe( id )
      } )
    } )
    describe( 'given a shabad order id', () => {} )
  } )

  describe( 'when a main line is set', () => {} )

  describe( 'when a next line is set', () => {} )
} )
