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
  app: Application,
}

const createThemesModule = async ( { app }: ThemesModuleOptions ) => {
  mounts.forEach( ( [ prefix, dir ] ) => app.use( prefix, express.static( dir ) ) )

  app.use( createApi() )

  // await copyExampleThemes()
}

export default createThemesModule
