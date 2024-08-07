import { firstLetterSearch, fullWordSearch } from '~/services/database'
import { SocketServer } from '~/services/websocket-server'

const searchHandlers = [
  [ 'first-letter', firstLetterSearch ],
  [ 'full-word', fullWordSearch ],
] as const

type SearchModuleOptions = {
  socketServer: SocketServer,
}

const createSearchModule = ( { socketServer }: SearchModuleOptions ) => {
  searchHandlers.forEach( ( [ name, searchFn ] ) => socketServer.on(
    `search:${name}`,
    ( { query, options }, { json } ) => void searchFn( query, options ).then( ( results ) => json( 'search:results', results ) )
  ) )
}

export default createSearchModule
