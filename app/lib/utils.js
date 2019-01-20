/**
 * Collection of utility functions.
 * @ignore
 */

import { hostname } from 'os'
import { reverse } from 'dns'
import { ensureDirSync } from 'fs-extra'
import { promisify } from 'util'
import { readdir } from 'fs-extra'
import { extname } from 'path'

import { CUSTOM_THEMES_FOLDER, DATA_FOLDER, HISTORY_FOLDER, TMP_FOLDER } from './consts'

const asyncReverse = promisify( reverse )

/**
 * Returns the hostname for the IP, if found, else the IP.
 * @param {string} hybridIP The IP address to resolve the hostname for.
 * @async
 * @returns {string} The resolved hostname.
 */
export const getHost = async hybridIP => {
  // Remove the IPv6 compoonent, if the address is a hybrid v4-v6
  const ip = hybridIP.replace( /^.*:/, '' )

  if ( ip === '127.0.0.1' || ip === '1' ) return hostname()

  try {
    const [ hostname ] = await asyncReverse( hybridIP )
    return hostname || ip
  } catch ( err ) {
    return ip
  }
}

/**
 * Converts the provided date into a filename-compatible string.
 * @param {Date} date The date to convert.
 * @returns {string} An illegal-character stripped string.
 */
export const getDateFilename = date => date.toISOString().replace( /T/, '_' ).replace( /:/g, '-' )

/**
 * Lists all CSS files in the given path.
 * @param {String} path The path to list all CSS files in.
 * @returns {Promise} An array of the listed CSS files
 */
export const listCSSFiles = async path => {
  const files = await readdir( path )
  return files.filter( file => extname( file ) === '.css' )
}

/*
 * Creates required filesystem directories for the app to work.
 */
export const ensureRequiredDirs = () => {
  const dirPerms = {
    mode: 0o2775,
  }

  ;[ DATA_FOLDER, CUSTOM_THEMES_FOLDER, HISTORY_FOLDER, TMP_FOLDER ]
    .map( dir => ensureDirSync( dir, dirPerms ) )
}
