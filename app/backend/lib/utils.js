/**
 * Collection of utility functions.
 * @ignore
 */

import { reverse } from 'dns'
import { promisify } from 'util'

import { satisfies, lt } from 'semver'

const asyncReverse = promisify( reverse )

/**
 * Determines whether an update is available, using semantic versioning.
 * @param current The current semantic version
 * @param remote The remove semantic version
 * @param range The semantic version range
 */
export const shouldUpdate = ( current, remote, range ) =>
  satisfies( remote, range ) && lt( current, remote )

/**
 * Returns the hostname for the IP, if found, else the IP.
 * @param hybridIP The IP address to resolve the hostname for
 */
export const getHost = async hybridIP => {
  // Remove the IPv6 compoonent, if the address is a hybrid v4-v6
  const ip = hybridIP.replace( /^.*:/, '' )
  try {
    const [ hostname ] = await asyncReverse( ip )
    return hostname || ip
  } catch ( err ) {
    return ip
  }
}
