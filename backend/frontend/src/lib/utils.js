/**
 * Utility functions.
 * @ignore
 */

/**
 * Gets the first letters in a space-separated string.
 * @param line The line to retrieve the first letters from.
 * @returns {string} The first letters of each word in the line.
 */
export const getFirstLetters = line => line
  .split( ' ' )
  .reduce( ( firstLetters, [ firstLetter ] ) => firstLetters + firstLetter, '' )
