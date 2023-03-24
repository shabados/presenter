import { Application } from 'express'

import { getBanis } from '../services/database'
import { SocketServer } from '../services/socket-server'
import createApi from './api'
import createState from './state'

type ContentModuleOptions = {
  api: Application,
  socketServer: SocketServer,
}

const createContentModule = ( { api, socketServer }: ContentModuleOptions ) => {
  api.use( createApi() )

  const state = createState()
  const { content,
    lineId,
    mainLineId,
    nextLineId,
    setMainLine,
    setNextLine,
    setLineId,
    setLineOrderId } = state

  // add parameter types to these functions
  const broadcast = ( event ) => ( data ) => socketServer.broadcast( event, () => data )
  const broadcastBanis = () => void getBanis().then( broadcast( 'content:bani:list' ) )

  content.onChange( broadcast( 'content:current' ) )
  lineId.onChange( broadcast( 'content:line:current' ) )
  mainLineId.onChange( broadcast( 'content:line:main' ) )
  nextLineId.onChange( broadcast( 'content:line:next' ) )

  socketServer.on( 'connection:ready', () => {
    broadcastBanis()

    broadcast( 'content:current' )( content.get() )
    broadcast( 'content:line:current' )( lineId.get() )
    broadcast( 'content:line:main' )( mainLineId.get() )
    broadcast( 'content:line:next' )( nextLineId.get() )
  } )

  socketServer.on( 'content:line:main', setMainLine )
  socketServer.on( 'content:line:next', setNextLine )
  socketServer.on( 'content:line:current', ( { transition, ...rest } ) => {
    // What is transition? It's not used anywhere. Do we need to infer it, or is it something that's explicitly passed in?
    if ( 'id' in rest ) setLineId( rest.id )
    if ( 'orderId' in rest ) setLineOrderId( rest.orderId )
  } )

  return state
}

export default createContentModule
