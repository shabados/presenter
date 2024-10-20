import { join } from 'node:path'

import { getLogger, UPDATES_FILE } from '@presenter/node'
import type { PackageJson } from 'type-fest'

import { APP_FOLDER } from '~/helpers/consts'
import { readJSON } from '~/helpers/files'
import { ExpressApi } from '~/services/express'

const log = getLogger( 'diagnostics' )

type UpdatesModuleOptions = {
  api: ExpressApi['api'],
}

type UpdatesJsonType = {
  prevVersion: string,
}

const createUpdatesModule = async ( { api }: UpdatesModuleOptions ) => {
  api.get( '/update', ( _, res ) => void Promise.all(
    [
      readJSON<PackageJson>( join( APP_FOLDER, 'package.json' ) ),
      readJSON<UpdatesJsonType>( UPDATES_FILE ),
    ]
  )
    .then( ( [ { version: currVersion },
      { prevVersion },
    ] ) => res.json( {
      prevVersion,
      currVersion,
    } ) )
    .catch( ( err ) => {
      log.error( err, 'Failed to read version JSON' )
    } ) )
}

export default createUpdatesModule
