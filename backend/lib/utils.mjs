/**
 * Collection of utility functions.
 * @ignore
 */

import fs from 'fs'
import util from 'util'

const { writeFile, readFile, rename } = fs
const { promisify } = util

// Promise wrappers around callback I/O functions
export const writeFileAsync = promisify( writeFile )
export const readFileAsync = promisify( readFile )
export const renameAsync = promisify( rename )
