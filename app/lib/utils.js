/**
 * Collection of utility functions.
 * @ignore
 */

import { hostname } from 'os'
import { reverse } from 'dns'
import { promisify } from 'util'

const asyncReverse = promisify( reverse )

/**
 * Returns the hostname for the IP, if found, else the IP.
 * @param {String} hybridIP The IP address to resolve the hostname for.
 * @async
 * @returns {String} The resolved hostname.
 */
export const getHost = async hybridIP => {
  // Remove the IPv6 compoonent, if the address is a hybrid v4-v6
  const ip = hybridIP.replace( /^.*:/, '' )

  if ( ip === '127.0.0.1' || ip === '1' ) { return hostname() }

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
 * @returns {String} An illegal-character stripped string.
 */
export const getDateFilename = date => date.toISOString().replace( /T/, '_' ).replace( /:/g, '-' )
