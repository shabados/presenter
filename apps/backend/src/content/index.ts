import { Application } from 'express'

import { SocketServer } from '../services/socket-server'
import createApi from './api'
import createState from './state'

type ContentModuleOptions = {
  app: Application,
  socketServer: SocketServer,
}

const createContentModule = ( { app, socketServer }: ContentModuleOptions ) => {
  app.use( createApi() )

  const { } = createState()
}

export default createContentModule
