import { stripVishraams, toAscii, firstLetters, stripAccents, toUnicode } from 'gurmukhi-utils'

import { SEARCH_TYPES } from '../../lib/consts'

const fullWordMatches = query => ( { target, gurmukhi } ) => {
  const baseGurmukhi = stripVishraams( gurmukhi )
  const baseTarget = stripVishraams( target )

  const sanitisedQuery = query.trim()

  const foundPosition = baseGurmukhi.search( sanitisedQuery )
  const matchStartPosition = baseGurmukhi.lastIndexOf( ' ', foundPosition )

  const wordEndPosition = baseGurmukhi.indexOf( ' ', foundPosition + sanitisedQuery.length )
  // If the match finishes in the last word, no space will be deteced, and wordEndPosition
  // will be -1. In this case, we want to end at the last position in the line.
  const matchEndPosition = wordEndPosition === -1 ? baseGurmukhi.length - 1 : wordEndPosition

  // Grab the word indexes in gurmukhi
  const [ wordMatchStart, wordMatchLength ] = [
    gurmukhi.substring( 0, matchStartPosition ).trim().split( ' ' ).length - 1,
    gurmukhi.substring( matchStartPosition, matchEndPosition ).trim().split( ' ' ).length,
  ]

  const words = baseTarget.split( ' ' )

  return [
    `${words.slice( 0, wordMatchStart ).join( ' ' )} `,
    `${words.slice( wordMatchStart, wordMatchStart + wordMatchLength ).join( ' ' )} `,
    `${words.slice( wordMatchStart + wordMatchLength ).join( ' ' )} `,
  ]
}

const firstLetterMatches = query => ( { target, gurmukhi } ) => {
  const baseGurmukhi = stripVishraams( gurmukhi )
  const baseLine = stripVishraams( target )

  const letters = toAscii( firstLetters( stripAccents( toUnicode( baseGurmukhi ) ) ) )
  const words = baseLine.split( ' ' )

  const startPosition = letters.search( stripAccents( query ) )
  const endPosition = startPosition + query.length

  return [
    `${words.slice( 0, startPosition ).join( ' ' )} `,
    `${words.slice( startPosition, endPosition ).join( ' ' )} `,
    `${words.slice( endPosition ).join( ' ' )} `,
  ]
}

const highlighters = {
  [ SEARCH_TYPES.fullWord ]: fullWordMatches,
  [ SEARCH_TYPES.firstLetter ]: firstLetterMatches,
}

/**
 * Separates the line into words before the first match, the first match, and after the match.
 * @param target The text to highlight.
 * @param context Contains gurmukhi and other contextual information required by all highlighters.
 * @param searchQuery The string inputted by the user.
 * @param searchMode The type of search being performed, either first word or full word.
 * @return An array of [ beforeMatch, match, afterMatch ],
 *   with `match` being the highlighted section.`.
 */
const getHighlighter = ( searchQuery, searchMode ) => context => target => {
  if ( !target ) return [ '', '', '' ]

  // Account for wildcard characters
  const sanitizedQuery = searchQuery.replace( new RegExp( '_', 'g' ), '.' )

  // Select the right higlighter
  const highlight = highlighters[ searchMode ]

  return highlight( sanitizedQuery )( { target, ...context } )
}

export default getHighlighter
