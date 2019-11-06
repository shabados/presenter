/**
 * Utility functions.
 * @ignore
 */

import { findDOMNode } from 'react-dom'
import scrollIntoView from 'scroll-into-view'
import deepmerge from 'deepmerge'
import queryString from 'qs'
import { debounce } from 'lodash'

import { PAUSE_CHARS, STATES, isMac } from './consts'

/**
 * Merges the source object into the destination, replacing arrays.
 * @param {Object} source The source object.
 * @param {Object} destination The destination object.
 */
export const merge = ( source, destination ) => deepmerge(
  source,
  destination,
  { arrayMerge: ( _, source ) => source },
)

/**
 * Removes the pause characters from the string.
 * @param line The line to remove the pause characters from.
 */
export const stripPauses = line => line.replace( new RegExp( `[${Object.values( PAUSE_CHARS )}]`, 'g' ), '' )

/**
 * Classifies the pause for a single word, returning an object of the word and type.
 * @param word The word to classify.
 * @param strip Whether or not to strip the vishraam character.
 */
export const classifyWord = ( word, strip = true ) => ( {
  word: strip ? stripPauses( word ) : word,
  type: Object
    .entries( { ...PAUSE_CHARS } )
    .reduce( ( type, [ pauseType, pauseChar ] ) => (
      // Check if last char in word is the current pause char, and return that type if so
      word.slice( -1 ) === pauseChar ? pauseType : type ), null ),
} )

/**
 * Returns an array of objects with their text and pause type.
 * @param line The line to process.
 * @param strip Whether or not to strip vishraam characters.
 */
export const classifyWords = ( line, strip = true ) => line.split( ' ' ).map( word => classifyWord( word, strip ) )

/**
 * Partitions the line by heavy pause into arrays.
 * @param line The line to partition.
 * @param strip Whether or not to strip vishraam chars from the word.
 */
export const partitionLine = ( line, strip = true ) => classifyWords( line, strip )
  .reduce( ( words, { type, word } ) => {
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
 * @param options Any options for the scroll function.
 */
// eslint-disable-next-line react/no-find-dom-node
export const scrollIntoCenter = ( ref, options ) => scrollIntoView( findDOMNode( ref ), ( {
  time: 200,
  ...options,
} ) )

/**
 * Returns the current query state of the URL, based on the defined states.
 * @param search The search component of the window location.
 * @returns {Object} Key-value pairs of the state and values.
 */
export const getUrlState = search => {
  const params = queryString.parse( search, { ignoreQueryPrefix: true } )

  return Object
    .entries( STATES )
    .reduce( ( acc, [ key, name ] ) => ( params[ name ] ? {
      ...acc,
      [ key ]: params[ name ],
    } : acc ), {} )
}

/**
 * Returns the corresponding translation for a given line.
 * @param {Object} [shabad] The current shabad.
 * @param {Object} line The current line.
 * @param {Object} sources Any sources.
 * @param {number} languageId The identifier of the language.
 */
export const getTranslation = ( { shabad, line, sources, recommendedSources, languageId } ) => {
  const { sourceId } = shabad || line.shabad

  if ( !( sources && sources[ sourceId ] ) ) return null

  const { id: translationId } = sources[ sourceId ].translationSources[ languageId ]
    || recommendedSources[ sourceId ].translationSources[ languageId ]
    || {}

  if ( !translationId ) return null

  return line.translations.find( (
    ( { translationSourceId: id } ) => translationId === id
  ) ).translation
}

/**
 * Returns the corresponding transliteration for a given line.
 * @param {Object} line The current line.
 * @param {number} languageId The identifier of the language.
 */
export const getTransliteration = ( line, languageId ) => line.transliterations.find( (
  ( { languageId: id } ) => languageId === id
) ).transliteration

export const debounceHotKey = fn => debounce( fn, 300, { leading: true } )

/**
 * Maps ctrl to cmd in keyMap if on Mac.
 * @param {*} keyMap An object of all the keys and mapped values.
 */
export const mapPlatformKeys = keyMap => ( isMac
  ? Object.entries( keyMap ).reduce( ( keyMap, [ name, sequences ] ) => ( {
    ...keyMap,
    [ name ]: sequences ? sequences.map( sequence => sequence.replace( 'ctrl', 'cmd' ) ) : null,
  } ), {} )
  : keyMap
)
