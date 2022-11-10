import { Router } from 'express'
import { arch, cpus, hostname, platform, release } from 'os'
import { join } from 'path'
import type { PackageJson } from 'type-fest'

import { APP_FOLDER, DATABASE_FOLDER } from './helpers/consts'
import { readJSON } from './helpers/files'
import { getNetworkedAddresses } from './helpers/network'
import { getLanguages, getSources, getWriters } from './services/database'

const api = Router()

api.get( '/sources', ( _, res ) => void getSources().then( res.json ) )

api.get( '/languages', ( _, res ) => void getLanguages().then( ( languages ) => res.json( { languages } ) ) )

api.get( '/writers', ( _, res ) => void getWriters().then( ( writers ) => res.json( { writers } ) ) )

export default api
