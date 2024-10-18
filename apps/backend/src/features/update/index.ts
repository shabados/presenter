import { ExpressApi } from '~/services/express'

type UpdatesModuleOptions = {
  api: ExpressApi['api'],
}

const createUpdatesModule = async ( { api }: UpdatesModuleOptions ) => {
  api.get( '/update', ( _, res ) => res.json( { prevVersion: '1.1.1', currVersion: '2.2.2' } ) )
}

export default createUpdatesModule
