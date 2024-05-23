import repl from 'node:repl'

import { ServerEvent, ServerEventParameters } from '@presenter/contract'
import { decode, encode } from '@presenter/swiss-knife'
import { WebSocket } from 'ws'

const timer = ( () => {
  let startTime = performance.now()
  let elapsed = 0

  const start = () => {
    startTime = performance.now()
  }

  const end = () => {
    elapsed = performance.now() - startTime
  }

  const getElapsed = () => elapsed.toFixed( 0 )

  const log = () => console.log( `${getElapsed()}ms` )

  return { start, end, log, getElapsed }
} )()

const responses = {} as Record<string, unknown>

const address = 'ws://localhost:42425'

const createClient = () => {
  const ws = new WebSocket( address )

  ws.once( 'error', ( e ) => {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.warn( 'Connection failed', message )

    // setTimeout( connect, 1000 )
  } )

  ws.once( 'close', () => {
    console.warn( 'Connection closed, reconnecting...' )

    setTimeout( createClient, 1000 )
  } )

  ws.on( 'message', ( m: string ) => {
    timer.end()

    const response = decode<{ event: string, payload: unknown }>( m )
    console.log( response, `${timer.getElapsed()}ms` )

    responses[ response.event ] = response.payload
  } )

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  client = ws
}

let client: WebSocket
createClient()

const send = <Event extends ServerEvent>(
  event: Event,
  payload: ServerEventParameters[Event]
) => {
  timer.start()
  client.send( encode( { event, payload } ) )
}

const methods = {
  send,
  responses,
  openWindow: () => send( 'action:open-window', undefined ),
  openExternalUrl: ( url: string ) => send( 'action:open-external-url', url ),
  openLogsFolder: () => send( 'action:open-logs-folder', undefined ),
  openOverlayFolder: () => send( 'action:open-overlay-folder', undefined ),
  searchFullWord: ( query: string ) => send( 'search:full-word', { query } ),
  searchFirstLetter: ( query: string ) => send( 'search:first-letter', { query } ),
  setShabad: ( id: string, lineId?: string ) => send( 'content:shabad:open', { id, lineId } ),
  setLine: ( id: string, transition?: boolean ) => send( 'content:line:set-current', { id, transition } ),
  setBani: ( id: number, lineId?: string ) => send( 'content:bani:open', { id, lineId } ),
  clearLine: () => send( 'content:line:clear', undefined ),
}

const methodNames = Object.keys( methods )

const completer = ( line: string ) => {
  const hits = methodNames.filter( ( name ) => line.startsWith( name ) )

  return [ hits.length ? hits : methodNames, line ]
}

const { context } = repl.start( { completer } )

Object.entries( methods ).forEach( ( [ name, method ] ) => { context[ name ] = method } )
