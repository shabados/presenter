/* eslint-disable no-param-reassign */
import { Server, WebSocket } from 'ws'

import { getHost } from '../../helpers/network'
import { ConnectionEventsServer, ConnectionEventsSocket } from './with-connection-state'

export type HostInformationSocket = WebSocket & {
  host: string,
}

const withHostInformation = <
  Socket extends ConnectionEventsSocket
>() => ( socketServer: Server<Socket> ) => {
  type AugmentedSocket = Socket & HostInformationSocket
  const server = socketServer as Server<AugmentedSocket> & ConnectionEventsServer<AugmentedSocket>

  server.onConnection( (
    client,
    { socket: { remoteAddress } }
  ) => getHost( remoteAddress! ).then( ( host ) => { client.host = host } ) )

  return server
}

export default withHostInformation
