/**
 * Utility functions.
 * @ignore
 */

import { findDOMNode } from 'react-dom'
import scrollIntoView from 'scroll-into-view'

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

/**
 * Classifies the pause for a single word, returning an object of the word and type.
 * @param word The word to classify.
 */
export const classifyWord = word => ( {
  word: stripPauses( word ),
  type: Object
    .entries( { ...PAUSE_CHARS } )
    .reduce( ( type, [ pauseType, pauseChar ] ) => (
      // Check if last char in word is the current pause char, and return that type if so
      word.slice( -1 ) === pauseChar ? pauseType : type ), null ),
} )

/**
 * Returns an array of objects with their text and pause type.
 * @param line The line to process.
 */
export const classifyWords = line => line.split( ' ' ).map( classifyWord )

/**
 * Partitions the line by heavy pause into arrays.
 * @param line The line to partition.
 */
export const partitionLine = line => classifyWords( line ).reduce( ( words, { type, word } ) => {
  // Get last list of words, removing it from the words list
  const lastWords = words.pop()

  // Add the words to the last list of words
  const nextWords = [ ...words, [ ...lastWords, { type, word } ] ]

  // If it's a heavy pause, start a new array after it for the next words
  return type === 'heavy' ? [ ...nextWords, [] ] : nextWords
}, [ [] ] )


/**
 * Scrolls an element into the center, given a ref.
 * @param ref The reference to the element to scroll.
 */
// eslint-disable-next-line react/no-find-dom-node
export const scrollIntoCenter = ref => scrollIntoView( findDOMNode( ref ), ( { time: 200 } ) )
