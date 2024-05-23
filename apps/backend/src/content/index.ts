import { Application } from 'express'

import { HistoryModule } from '~/history'
import { getBanis } from '~/services/database'
import { SocketServer } from '~/services/websocket-server'

import createApi from './api'
import createState from './state'

type ContentModuleOptions = {
  api: Application,
  socketServer: SocketServer,
  history: HistoryModule,
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
    clearLine,
    setShabad,
    setNextLine,
    setPreviousLine,
    setBani,
    setNextContent,
    setPreviousContent,
  } = state

  content.onChange( socketServer.broadcast( 'content:current' ) )
  lineId.onChange( socketServer.broadcast( 'content:line:current' ) )
  trackerMainLineId.onChange( socketServer.broadcast( 'content:tracker:main-line' ) )
  trackerNextLineId.onChange( socketServer.broadcast( 'content:tracker:next-line' ) )

  socketServer.on( 'client:connected', ( { json } ) => {
    void getBanis().then( ( banis ) => json( 'content:bani:list', banis ) )
    json( 'content:current', content.get() )
    json( 'content:line:current', lineId.get() )
    json( 'content:tracker:main-line', trackerMainLineId.get() )
    json( 'content:tracker:next-line', trackerNextLineId.get() )
  } )

  socketServer.on( 'content:tracker:set-main-line', setTrackerMainLine )
  socketServer.on( 'content:tracker:set-next-line', setTrackerNextLine )
  socketServer.on( 'content:line:clear', clearLine )
  socketServer.on( 'content:line:set-current', setLine )
  socketServer.on( 'content:line:set-next', setNextLine )
  socketServer.on( 'content:line:set-previous', setPreviousLine )
  socketServer.on( 'content:shabad:open', ( options ) => void setShabad( options ) )
  socketServer.on( 'content:bani:open', ( options ) => void setBani( options ) )
  socketServer.on( 'content:open-previous', () => void setPreviousContent() )
  socketServer.on( 'content:open-next', () => void setNextContent() )

  return state
}

export default createContentModule
