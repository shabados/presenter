import { copyFile } from 'node:fs/promises'
import { join } from 'node:path'

import { CUSTOM_OVERLAY_THEMES_FOLDER, CUSTOM_THEMES_FOLDER } from '@presenter/node/src'
import express, { Application } from 'express'

import { FRONTEND_OVERLAY_THEMES_FOLDER, FRONTEND_THEMES_FOLDER } from '../helpers/consts'
import createApi from './api'

const copyExampleThemes = () => Promise.all( [
  [ FRONTEND_OVERLAY_THEMES_FOLDER, CUSTOM_OVERLAY_THEMES_FOLDER ],
  [ FRONTEND_THEMES_FOLDER, CUSTOM_THEMES_FOLDER ],
].map( ( [ src, dest ] ) => copyFile(
  join( src, 'Example.template' ),
  join( dest, 'Example.css' ),
) ) )

const mounts = [
  [ '/presenter/themes', FRONTEND_THEMES_FOLDER ],
  [ '/presenter/themes', CUSTOM_THEMES_FOLDER ],
  [ '/presenter/themes/*', join( FRONTEND_OVERLAY_THEMES_FOLDER, 'Day.css' ) ],
  [ '/overlay/themes', FRONTEND_OVERLAY_THEMES_FOLDER ],
  [ '/overlay/themes/', CUSTOM_OVERLAY_THEMES_FOLDER ],
] as const

type ThemesModuleOptions = {
  api: Application,
}

const createThemesModule = async ( { api }: ThemesModuleOptions ) => {
  mounts.forEach( ( [ prefix, dir ] ) => api.use( prefix, express.static( dir ) ) )

  api.use( createApi() )

  // TODO: uncomment when we have a way to copy example themes
  // await copyExampleThemes()
}

export default createThemesModule
