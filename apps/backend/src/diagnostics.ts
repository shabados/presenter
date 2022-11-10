import { arch, cpus, hostname, platform, release } from 'node:os'
import { join } from 'node:path'

import { Application, Router } from 'express'
import type { PackageJson } from 'type-fest'

import { APP_FOLDER, DATABASE_FOLDER } from './helpers/consts'
import { readJSON } from './helpers/files'
import { getNetworkedAddresses } from './helpers/network'

type DiagnosticsModuleOptions = {
  app: Application,
}

const createDiagnosticsModule = ( { app }: DiagnosticsModuleOptions ) => {
  const api = Router()

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

  app.use( api )
}

export default createDiagnosticsModule
