import { Router } from 'express'
import { basename, join } from 'path'
import { hostname, platform, arch, cpus } from 'os'
import { readJSON } from 'fs-extra'

import { CUSTOM_THEMES_FOLDER, APP_FOLDER, FRONTEND_THEMES_FOLDER, DATABASE_FOLDER, CUSTOM_OVERLAY_THEMES_FOLDER, FRONTEND_OVERLAY_THEMES_FOLDER } from './consts'
import { listCSSFiles, getNetworkedAddresses } from './utils'
import { getSources, getLanguages, getWriters } from './db'

const api = Router()

// Register heartbeat route
api.get( '/heartbeat', ( _, res ) => res.send( 'alive' ) )

// Serve any themes
api.get( '/presenter/themes', ( _, res ) => Promise.all( (
  [ FRONTEND_THEMES_FOLDER, CUSTOM_THEMES_FOLDER ].map( listCSSFiles )
) ).then( ( [ themes, customThemes ] ) => res.json( [ ...themes, ...customThemes ].map( x => basename( x, '.css' ) ) ) ) )

// Serve any overlay themes
api.get( '/overlay/themes', ( _, res ) => Promise.all( (
  [ FRONTEND_OVERLAY_THEMES_FOLDER, CUSTOM_OVERLAY_THEMES_FOLDER ].map( listCSSFiles )
) ).then( ( [ themes, customThemes ] ) => res.json( [ ...themes, ...customThemes ].map( x => basename( x, '.css' ) ) ) ) )

// Version information
api.get( '/about', ( _, res ) => Promise.all( [
  readJSON( join( APP_FOLDER, 'package.json' ), 'utf-8' ),
  readJSON( join( DATABASE_FOLDER, 'package.json' ), 'utf-8' ),
] ).then( ( [ { version }, { version: databaseVersion } ] ) => res.json( {
  version,
  databaseVersion,
  hostname: hostname(),
  arch: arch(),
  cpus: `${cpus().length}x ${cpus()[ 0 ].model}`,
  platform: platform(),
  addresses: getNetworkedAddresses(),
} ) ) )

// Gurbani Sources, with possible and recommended translations
api.get( '/sources', ( _, res ) => getSources().then( sources => res.json( sources ) ) )

// Gurbani Sources, with possible translations
api.get( '/languages', ( _, res ) => getLanguages().then( languages => res.json( { languages } ) ) )

// Writers/authors
api.get( '/writers', ( _, res ) => getWriters().then( writers => res.json( { writers } ) ) )

export default api
