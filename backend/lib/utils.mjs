/**
 * Collection of utility functions.
 * @ignore
 */

import fs from 'fs'

const { readFileSync, writeFileSync } = fs

/**
 * Saves a formatted JSON object to `path`.
 * @param path The path to save the json to
 * @param json The js object to serialise to json
 */
export const saveJsonSync = ( path, json ) => writeFileSync(
  path,
  JSON.stringify( json, null, 2 ),
)


/**
 * Reads a JSON object at `path`.
 * @param path The path to read the JSON object from
 */
export const readJsonSync = path => JSON.parse( readFileSync( path ) )
