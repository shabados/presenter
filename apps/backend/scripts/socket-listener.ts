import repl from 'node:repl'

import { ServerEvent, ServerEventParameters } from '@presenter/contract'
import { WebSocket } from 'ws'

const client = new WebSocket( 'ws://localhost:42425' )

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

client.on( 'message', ( m: string ) => {
  timer.end()

  console.log( JSON.parse( m ), `${timer.getElapsed()}ms` )
} )

const send = <Event extends ServerEvent>(
  event: Event,
  payload: ServerEventParameters[Event]
) => {
  timer.start()
  client.send( JSON.stringify( { event, payload } ) )
}

const methods = {
  send,
  openWindow: () => send( 'action:open-window', undefined ),
  openExternalUrl: ( url: string ) => send( 'action:open-external-url', url ),
  openLogsFolder: () => send( 'action:open-logs-folder', undefined ),
  openOverlayFolder: () => send( 'action:open-overlay-folder', undefined ),
  searchFullWord: ( query: string ) => send( 'search:full-word', { query } ),
  searchFirstLetter: ( query: string ) => send( 'search:first-letter', { query } ),
}

const methodNames = Object.keys( methods )

const completer = ( line: string ) => {
  const hits = methodNames.filter( ( name ) => line.startsWith( name ) )

  return [ hits.length ? hits : methodNames, line ]
}

const { context } = repl.start( { completer } )

Object.entries( methods ).forEach( ( [ name, method ] ) => { context[ name ] = method } )
