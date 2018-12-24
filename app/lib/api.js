import { Router } from 'express'
import { basename } from 'path'

import { CUSTOM_THEMES_FOLDER } from './consts'
import { listCSSFiles } from './utils'

const api = Router()

// Register heartbeat route
api.get( '/heartbeat', ( _, res ) => res.send( 'alive' ) )

api.get( '/themes', ( _, res ) => Promise.all( (
  [ 'frontend/themes', CUSTOM_THEMES_FOLDER ].map( listCSSFiles )
) ).then( ( [ themes, customThemes ] ) => res.json( [ ...themes, ...customThemes ].map( x => basename( x, '.css' ) ) ) ) )

export default api
