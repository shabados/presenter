import { Application } from 'express'
import { clearLine } from 'readline'

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
  const {
    content,
    lineId,
    trackerMainLineId,
    trackerNextLineId,
    setTrackerMainLine,
    setTrackerNextLine,
    setLine,
    setShabad,
    setNextShabad,
    setPreviousShabad,
    setNextLine,
    setPreviousLine,
    setBookmark,
    clearLine,
  } = state

  content.onChange( socketServer.broadcast( 'content:current' ) )
  lineId.onChange( socketServer.broadcast( 'content:line:current' ) )
  trackerMainLineId.onChange( socketServer.broadcast( 'content:tracker:main-line' ) )
  trackerNextLineId.onChange( socketServer.broadcast( 'content:tracker:next-line' ) )

  socketServer.on( 'connection:ready', ( { sendJSON } ) => {
    void getBanis().then( ( banis ) => sendJSON( 'content:bookmark:list', banis ) )
    sendJSON( 'content:current', content.get() )
    sendJSON( 'content:line:current', lineId.get() )
    sendJSON( 'content:tracker:main-line', trackerMainLineId.get() )
    sendJSON( 'content:tracker:next-line', trackerNextLineId.get() )
  } )

  socketServer.on( 'content:tracker:set-main-line', setTrackerMainLine )
  socketServer.on( 'content:tracker:set-next-line', setTrackerNextLine )
  socketServer.on( 'content:line:clear', clearLine )
  socketServer.on( 'content:line:set-current', setLine )
  socketServer.on( 'content:line:set-next', setNextLine )
  socketServer.on( 'content:line:set-previous', setPreviousLine )
  // socketServer.on( 'content:shabad:set-current', setShabad )
  // socketServer.on( 'content:shabad:set-next', setNextShabad )
  // socketServer.on( 'content:shabad:set-previous', setPreviousShabad )
  // socketServer.on( 'content:bookmark:set', setBookmark )

  return state
}

export default createContentModule
