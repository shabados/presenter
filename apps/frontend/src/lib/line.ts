/**
 ** Currently shared with backend! Should be refactored.
 */

import type { Line } from '@presenter/contract'
import { stripEndings, stripVishraams } from 'gurmukhi-utils'
import vishraams from 'gurmukhi-utils/lib/vishraams.json'
import memoize from 'memoizee'

import { LINE_TYPES, TRANSLITERATORS } from './data'

/**
 * Produces a map of the line hotkey that corresponds to the line index.
 * @param {*} An Object containing a shabad or bani, which contains lines.
 */
export const findLineIndex = memoize(
  ( lines: Line[], lineId: string ) => lines.findIndex( ( { id } ) => id === lineId ),
  {
    primitive: true,
    max: 5,
    normalizer: ( [ , lineId ] ) => lineId,
  },
)

type CustomiseLineParams = { lineEnding: boolean, typeId: number }
type LineTransformer = [boolean, ( text: string ) => string]

/**
 *
 * @param {string} line The line to modify.
 * @param {Object} settings Different boolean values for transformations.
 * @returns {string} With different transformations applied.
 */
export const customiseLine = ( line: string, { lineEnding, typeId }: CustomiseLineParams ) => ( [
  [ lineEnding, stripEndings ],
] as LineTransformer[] )
  .filter( ( [ predicate ] ) => predicate )
  .reduce( ( line, [ , fn ] ) => (
    // Skip stripEndings for Sirlekh
    typeId === LINE_TYPES.sirlekh ? line : fn( line )
  ), line )

/**
 * Classifies the pause for a single word, returning an object of the word and type.
 * @param word The word to classify.
 * @param strip Whether or not to strip the vishraam character.
 */
export const classifyWord = ( word: string, strip: boolean = true ) => ( {
  word: strip ? stripVishraams( word ) : word,
  type: Object
    .entries( vishraams )
    .reduce( ( type, [ pauseType, pauseChar ] ) => (
      // Check if last char in word is the current pause char, and return that type if so
      word.slice( -1 ) === pauseChar ? pauseType : type ), null ),
} )

/**
 * Returns an array of objects with their text and pause type.
 * @param line The line to process.
 * @param strip Whether or not to strip vishraam characters.
 */
export const classifyWords = ( line: string, strip: boolean = true ) => line.split( ' ' ).map( ( word ) => classifyWord( word, strip ) )

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

  const { translation } = line.translations.find( (
    ( { translationSourceId: id } ) => translationId === id
  ) )

  return translation
}

export const getTranslations = ( { languageIds, line, ...rest } ) => {
  if ( !line ) return {}

  return ( languageIds || [] ).filter( ( x ) => x ).reduce( ( translations, languageId ) => {
    const translation = getTranslation( { languageId, line, ...rest } )

    return translation ? { ...translations, [  languageId ]: translation } : translations
  }, {} )
}

/**
 * Returns the corresponding transliteration functions, mapped by language id.
 */
export const getTransliterators = ( languageIds: number[] ) => ( languageIds || [] )
  .filter( ( id ) => id && TRANSLITERATORS[ id ] )
  .reduce( ( translations, languageId ) => ( {
    ...translations,
    [ languageId ]: TRANSLITERATORS[ languageId ],
  } ), {} )
