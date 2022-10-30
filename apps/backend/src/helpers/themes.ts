import { copyFile, readdir } from 'node:fs/promises'

import { CUSTOM_OVERLAY_THEMES_FOLDER, CUSTOM_THEMES_FOLDER } from '@presenter/node'
import { basename, extname, join } from 'path'

import { FRONTEND_OVERLAY_THEMES_FOLDER, FRONTEND_THEMES_FOLDER } from './consts'

const listCSSFiles = ( path: string ) => readdir( path )
  .then( ( files ) => files.map( extname ).filter( ( extension ) => extension === '.css' ) )

const getThemeNames = ( folders: string[] ) => Promise
  .all( folders.map( listCSSFiles ) )
  .then( ( themeFolders ) => themeFolders.flatMap( ( themes ) => themes ) )
  .then( ( files ) => files.map( ( filename ) => basename( filename, '.css' ) ) )

export const getPresenterThemeNames = () => getThemeNames( [
  FRONTEND_THEMES_FOLDER,
  CUSTOM_THEMES_FOLDER,
] )

export const getOverlayThemeNames = () => getThemeNames( [
  FRONTEND_OVERLAY_THEMES_FOLDER,
  CUSTOM_OVERLAY_THEMES_FOLDER,
] )

export const copyExampleThemes = () => Promise.all( [
  [ FRONTEND_OVERLAY_THEMES_FOLDER, CUSTOM_OVERLAY_THEMES_FOLDER ],
  [ FRONTEND_THEMES_FOLDER, CUSTOM_THEMES_FOLDER ],
].map( ( [ src, dest ] ) => copyFile(
  join( src, 'Example.template' ),
  join( dest, 'Example.css' ),
) ) )
