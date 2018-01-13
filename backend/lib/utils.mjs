/**
 * Collection of utility functions.
 * @ignore
 */

import { satisfies, lt } from 'semver'

/**
 * Determines whether an update is available, using semantic versioning.
 * @param current The current semantic version
 * @param remote The remove semantic version
 * @param range The semantic version range
 */
export const shouldUpdate = ( current, remote, range ) =>
  satisfies( remote, range ) && lt( current, remote )
