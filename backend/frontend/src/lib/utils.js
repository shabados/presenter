/**
 * Utility functions.
 * @ignore
 */

import { PAUSE_CHARS } from './consts'

/**
 * Gets the first letters in a space-separated string.
 * @param line The line to retrieve the first letters from.
 * @returns {string} The first letters of each word in the line.
 */
export const getFirstLetters = line => line
  .split( ' ' )
  .reduce( ( firstLetters, [ firstLetter ] ) => firstLetters + firstLetter, '' )

/**
 * Removes the pause characters from the string.
 * @param line The line to remove the pause characters from.
 */
export const stripPauses = line =>
  line.replace( new RegExp( `[${Object.values( PAUSE_CHARS )}]`, 'g' ), '' )
