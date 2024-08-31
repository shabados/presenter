/**
 ** Currently shared with backend! Should be refactored.
 */

import type { Line, RecommendedSources, Shabad, Translation } from '@presenter/contract'
import { stripEndings, stripVishraams } from 'gurmukhi-utils'
import vishraams from 'gurmukhi-utils/lib/vishraams.json'
import memoize from 'memoizee'

import { LINE_TYPES, Translations, TRANSLITERATORS, Transliterators } from './data'

export const sortBy = (
  sortOrder: Record<string, number>
) => (
  [ languageA ]: [string, any],
  [ languageB ]: [string, any]
) => sortOrder[ languageA ] - sortOrder[ languageB ]

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

export const customiseLine = ( line: string, { lineEnding, typeId }: CustomiseLineParams ) => ( [
  [ lineEnding, stripEndings ],
] as LineTransformer[] )
  .filter( ( [ predicate ] ) => predicate )
  .reduce( ( line, [ , fn ] ) => (
    // Skip stripEndings for Sirlekh
    typeId === LINE_TYPES.sirlekh ? line : fn( line )
  ), line )

export const classifyWord = ( word: string, strip = true ) => ( {
  word: strip ? stripVishraams( word ) : word,
  type: Object
    .entries( vishraams )
  // TODO: Do we want type to be null or a blank string?
    .reduce( ( type: string | null, [ pauseType, pauseChar ] ) => (
      // Check if last char in word is the current pause char, and return that type if so
      word.slice( -1 ) === pauseChar ? pauseType : type ), null ),
} )

export const classifyWords = ( line: string, strip = true ) => line.split( ' ' ).map( ( word ) => classifyWord( word, strip ) )

type ClassifiedWords = { type: string | null, word: string }

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

export const getTranslation = (
  { shabad, line, sources, recommendedSources, languageId }: GetTranslationParams
) => {
  const { sourceId } = shabad || line.shabad

  if ( !( sources?.[ sourceId ] ) ) return null

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
   shabad: Shabad | null,
   sources: RecommendedSources['sources'],
   recommendedSources: RecommendedSources['recommendedSources'],
 }

export const getTranslations = ( { languageIds, line, ...rest }: GetTranslationsParams ) => {
  if ( !line ) return {}

  return ( languageIds || [] ).filter( ( x ) => x ).reduce( ( translations, languageId ) => {
    const translation = getTranslation( { languageId, line, ...rest } )

    return translation ? { ...translations, [ languageId ]: translation } : translations
  }, {} as Translations )
}

export const getTransliterators = ( languageIds: number[] ) => ( languageIds || [] )
  .filter( ( id ) => id && TRANSLITERATORS[ id ] )
  .reduce( ( translations, languageId ) => ( {
    ...translations,
    [ languageId ]: TRANSLITERATORS[ languageId ],
  } ), {} as Transliterators )
