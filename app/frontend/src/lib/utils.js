/**
 * Utility functions.
 * @ignore
 */

import { findDOMNode } from 'react-dom'
import scrollIntoView from 'scroll-into-view'
import deepmerge from 'deepmerge'
import queryString from 'qs'
import { find, findIndex, findLastIndex, debounce, invert } from 'lodash'
import memoize from 'memoizee'

import { PAUSE_CHARS, STATES, isMac, BANIS } from './consts'

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

/**
 * Produces a map of the line hotkey that corresponds to the line index.
 * @param {*} An Object containing a shabad or bani, which contains lines.
 */
export const findLineIndex = memoize(
  ( lines, lineId ) => lines.findIndex( ( { id } ) => id === lineId ),
  {
    primitive: true,
    max: 5,
    normalizer: ( [ , lineId ] ) => lineId,
  },
)

const isBaniJumpLine = ( baniId, lines ) => (
  { jumpLines },
  { id, lineGroup, gurmukhi },
  index,
) => {
  // Set the jump if it hasn't been set for the line group already
  // eslint-disable-next-line no-unused-vars
  const lineGroupFilter = () => typeof jumpLines[ lineGroup - 1 ] === 'undefined'
  // Set the jump at each line end
  const previousNumberFilter = () => ( index > 0 ? lines[ index - 1 ].gurmukhi.match( /](\d*)]$/ ) : true )

  // Filters for different banis
  const additionalFilters = {
    // Asa Di Vaar
    [ BANIS.ASA_KI_VAAR ]: () => previousNumberFilter() && !gurmukhi.match( /(pauVI ]|mhlw \d* ]|mÚ \d* ])/ ) && id !== '6WX1',
  }

  const filter = additionalFilters[ baniId ] || previousNumberFilter

  return filter()
}

/**
 * Produces a map of the line hotkey that corresponds to the line index.
 * @param {*} An Object containing a shabad or bani, which contains lines.
 */
export const getJumpLines = memoize( ( { shabad, bani } ) => {
  if ( !( shabad || bani ) ) return {}

  const { lines } = shabad || bani

  // Get a function for determining whether a line is jumpable
  const isJumpLine = bani ? isBaniJumpLine( bani.id, lines ) : () => true

  // Go over each line, and tag which lines are jumpable
  const { jumpLines } = lines.reduce( ( { jumpLines, jumpIndex }, line, lineIndex ) => ( {
    // Retain the current jump index and jump lines
    jumpIndex,
    jumpLines,

    // If the current line is jumpable line, add it and move to the next
    ...( isJumpLine( { jumpLines, jumpIndex }, line, lineIndex ) && {
      jumpIndex: jumpIndex + 1,
      jumpLines: { ...jumpLines, [ jumpIndex ]: line.id },
    } ),
  } ), { jumpIndex: 0, jumpLines: {} } )


  return jumpLines
}, {
  primitive: true,
  max: 1,
  normalizer: ( [ { bani, shabad } ] ) => JSON.stringify( {
    shabadId: ( shabad ? shabad.id : null ),
    baniId: ( bani ? bani.id : null ),
  } ),
} )


export const getBaniNextJumpLine = ( { bani, lineId } ) => {
  const { lines } = bani

  // Get jump lines and current line index
  const jumpLines = invert( getJumpLines( { bani } ) )
  const currentLineIndex = findLineIndex( lines, lineId )
  const currentLine = lines[ currentLineIndex ]

  // Get next jump line by searching for it from the current line's index
  const nextJumpLineFinder = () => find(
    lines,
    ( { id } ) => !!jumpLines[ id ],
    Math.min( currentLineIndex + 1, lines.length - 1 ),
  ) || {}

  // Returns a line from the current line's index, based on a regex
  const regexFinder = ( regex, forward = true, offset = currentLineIndex ) => {
    const regexp = new RegExp( regex )

    const findFn = forward ? findIndex : findLastIndex

    return findFn( lines, ( { gurmukhi } ) => regexp.test( gurmukhi ), offset )
  }

  // Gets the next line after the last pauri
  const asaDiVaarFinder = () => {
    if ( !currentLine ) return null

    // Regexes for catching the end of a section and pauri
    const pauriRegex = /pauVI ]/
    const sectionRegex = /](\d*)]$/

    // Get the start and end indicies of the previous pauri, if any
    const previousPauriStartIndex = regexFinder( pauriRegex, false ) + 1
    const previousPauriEndIndex = regexFinder( sectionRegex, true, previousPauriStartIndex )

    // Get the index of the section after the previous pauri
    const sectionStartIndex = previousPauriStartIndex
      ? regexFinder( sectionRegex, false, currentLineIndex - 1 ) + 1
      : 0

    // A chant begins after a pauri ends
    const inChant = sectionStartIndex === previousPauriEndIndex + 1 || sectionStartIndex === 0
    // A pauri begins if the current section is where the pauri begins
    const inPauri = sectionStartIndex + 1 === previousPauriStartIndex

    // Get the last line in the section
    const sectionEndIndex = previousPauriEndIndex > -1
      ? regexFinder( sectionRegex )
      : lines.length - 1

    // Disable if the current section isn't section after the pauri (the chant) or the pauri section
    if ( !inPauri && !inChant && previousPauriStartIndex !== 0 ) return null

    // If on the pauri title line, jump to the last line of the pauri
    if ( currentLineIndex === previousPauriStartIndex - 1 ) return lines[ sectionEndIndex ]

    if ( inPauri ) {
      // If on the first line in the pauri, jump to the end of the pauri
      if ( previousPauriStartIndex === currentLineIndex ) return lines[ sectionEndIndex ]
      // If on any other line in the pauri, jump to the start of the pauri
      if ( sectionEndIndex >= currentLineIndex ) return lines[ previousPauriStartIndex ]
    }

    if ( inChant ) {
      // If on the first line in the chant section, jump to the end of the section
      if ( sectionStartIndex === currentLineIndex ) return lines[ sectionEndIndex ]
      // If on any other line in the chant section, jump to the first line in the section
      if ( sectionEndIndex >= currentLineIndex ) return lines[ sectionStartIndex ]
    }

    return null
  }

  // Next line jump finder overrides for specific banis
  const additionalFinders = {
    [ BANIS.ASA_KI_VAAR ]: asaDiVaarFinder,
  }

  const findNextJumpLine = additionalFinders[ bani.id ] || nextJumpLineFinder

  const { id: baniNextLineId } = findNextJumpLine() || {}
  return baniNextLineId
}

/**
 * Gets the next jump line id for a shabad or bani.
 * @param {*} An Object containing a shabad or bani, which contains lines.
 */
export const getNextJumpLine = ( { nextLineId, shabad, bani, lineId } ) => {
  if ( !( shabad || bani ) ) return null

  return shabad ? nextLineId : getBaniNextJumpLine( { bani, lineId } )
}
