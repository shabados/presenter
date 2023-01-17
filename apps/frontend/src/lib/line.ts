/**
 ** Currently shared with backend! Should be refactored.
 */

import type { Line, Shabad, Source, Translation } from '@presenter/contract'
import { stripEndings, stripVishraams } from 'gurmukhi-utils'
import vishraams from 'gurmukhi-utils/lib/vishraams.json'
import memoize from 'memoizee'

import { LINE_TYPES, TRANSLITERATORS } from './data'

export const sortBy = (
  sortOrder: Record<string, number>
) => ( [ languageA ]: [string, any], [ languageB ]: [string, any] ) => sortOrder[ languageA ] - sortOrder[ languageB ]

/**
  * Produces a map of the line hotkey that corresponds to the line index.
  * @param {*} An Object containing a shabad or bani, which contains lines.
  */
export const findLineIndex = memoize(
  ( lines: Line[], lineId = '' ) => lines.findIndex( ( { id } ) => id === lineId ),
  {
    primitive: true,
    max: 5,
    normalizer: ( [ , lineId ] ) => lineId as string,
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
export const classifyWord = ( word: string, strip = true ) => ( {
  word: strip ? stripVishraams( word ) : word,
  type: Object
    .entries( vishraams )
  // TODO: Do we want type to be null or a blank string?
    .reduce( ( type: string | null, [ pauseType, pauseChar ] ) => (
      // Check if last char in word is the current pause char, and return that type if so
      word.slice( -1 ) === pauseChar ? pauseType : type ), null ),
} )

/**
  * Returns an array of objects with their text and pause type.
  * @param line The line to process.
  * @param strip Whether or not to strip vishraam characters.
  */
export const classifyWords = ( line: string, strip = true ) => line.split( ' ' ).map( ( word ) => classifyWord( word, strip ) )

 type ClassifiedWords = { type: string | null, word: string }
 /**
  * Partitions the line by heavy pause into arrays.
  * @param line The line to partition.
  * @param strip Whether or not to strip vishraam chars from the word.
  */
export const partitionLine = ( line: string, strip = true ) => classifyWords( line, strip )
  .reduce( ( words: ClassifiedWords[][], { type, word } ) => {
    // Get last list of words, removing it from the words list
    const lastWords = words.pop() || []

    // Add the words to the last list of words
    const nextWords = [ ...words, [ ...lastWords, { type, word } ] ]

    // If it's a heavy pause, start a new array after it for the next words
    return type === 'heavy' ? [ ...nextWords, [] ] : nextWords
  }, [ [] ] )

 type GetTranslationParams = {
   shabad: Shabad,
   line: Line,
   sources: Source,
   recommendedSources: Source,
   languageId: number,
 }
 /**
  * Returns the corresponding translation for a given line.
  * @param {Object} [shabad] The current shabad.
  * @param {Line} line The current line.
  * @param {Source} sources Any sources.
  * @param {Source} recommendedSources Any sources.
  * @param {number} languageId The identifier of the language.
  */
export const getTranslation = (
  { shabad, line, sources, recommendedSources, languageId }: GetTranslationParams
) => {
  const { sourceId } = shabad || line.shabad

  if ( !( sources && sources[ sourceId ] ) ) return null

  const { id: translationId } = sources[ sourceId ].translationSources[ languageId ]
     || recommendedSources[ sourceId ].translationSources[ languageId ]
     || {}

  if ( !translationId ) return null

  const { translation } = ( line.translations as Translation[] ).find( (
    ( { translationSourceId: id }: { translationSourceId: number } ) => translationId === id
  ) ) as { translation: string }

  return translation
}

 type GetTranslationsParams = {
   languageIds: number[],
   line: Line,
   shabad: Shabad,
   sources: Source,
   recommendedSources: Source,
 }

export const getTranslations = ( { languageIds, line, ...rest }: GetTranslationsParams ) => {
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
