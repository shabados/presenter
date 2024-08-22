import { copyFile } from 'node:fs/promises'
import { join } from 'node:path'

import { USER_OVERLAY_THEMES_FOLDER, USER_PRESENTER_THEMES_FOLDER } from '@presenter/node'
import express, { Application } from 'express'

import { OVERLAY_THEMES_FOLDER, PRESENTER_THEMES_FOLDER } from '~/helpers/consts'

import { getOverlayThemeNames, getPresenterThemeNames } from './themes'

const copyExampleThemes = () => Promise.all( [
  [ OVERLAY_THEMES_FOLDER, USER_OVERLAY_THEMES_FOLDER ],
  [ PRESENTER_THEMES_FOLDER, USER_PRESENTER_THEMES_FOLDER ],
].map( ( [ src, dest ] ) => copyFile(
  join( src, 'Example.template' ),
  join( dest, 'Example.css' ),
) ) )

const mounts = [
  [ 'presenter', PRESENTER_THEMES_FOLDER ],
  [ 'presenter', USER_PRESENTER_THEMES_FOLDER ],
  [ 'overlay', OVERLAY_THEMES_FOLDER ],
  [ 'overlay', USER_OVERLAY_THEMES_FOLDER ],
] as const

type ThemesModuleOptions = {
  api: Application,
}

const createThemesModule = async ( { api }: ThemesModuleOptions ) => {
  mounts.forEach( ( [ prefix, dir ] ) => api.use( `/themes/${prefix}`, express.static( dir ) ) )

  api.get( '/themes/presenter', ( _, res ) => void getPresenterThemeNames().then( ( r ) => res.json( r ) ) )
  api.get( '/themes/overlay', ( _, res ) => void getOverlayThemeNames().then( ( r ) => res.json( r ) ) )

  await copyExampleThemes()
}

export default createThemesModule
