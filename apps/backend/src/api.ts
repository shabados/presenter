import { Router } from 'express'
import { arch, cpus, hostname, platform, release } from 'os'
import { join } from 'path'
import type { PackageJson } from 'type-fest'

import { APP_FOLDER, DATABASE_FOLDER } from './helpers/consts'
import { readJSON } from './helpers/files'
import { getNetworkedAddresses } from './helpers/network'
import { getOverlayThemeNames, getPresenterThemeNames } from './helpers/themes'
import { getLanguages, getSources, getWriters } from './services/database'

const api = Router()

api.get( '/heartbeat', ( _, res ) => res.send( 'alive' ) )

api.get( '/presenter/themes', ( _, res ) => void getPresenterThemeNames().then( res.json ) )

api.get( '/overlay/themes', ( _, res ) => void getOverlayThemeNames().then( res.json ) )

api.get( '/about', ( _, res ) => void Promise.all( [
  readJSON<PackageJson>( join( APP_FOLDER, 'package.json' ) ),
  readJSON<PackageJson>( join( DATABASE_FOLDER, 'package.json' ) ),
] ).then( ( [ { version }, { version: databaseVersion } ] ) => res.json( {
  version,
  databaseVersion,
  hostname: hostname(),
  arch: arch(),
  cpus: `${cpus().length}x ${cpus()[ 0 ].model}`,
  platform: platform(),
  release: release(),
  addresses: getNetworkedAddresses(),
} ) ) )

api.get( '/sources', ( _, res ) => void getSources().then( res.json ) )

api.get( '/languages', ( _, res ) => void getLanguages().then( ( languages ) => res.json( { languages } ) ) )

api.get( '/writers', ( _, res ) => void getWriters().then( ( writers ) => res.json( { writers } ) ) )

export default api
