import { firstLetters, stripAccents, stripVishraams, toAscii, toUnicode } from 'gurmukhi-utils'

import { SEARCH_TYPES } from '~/helpers/consts'

type MatchOptions = {
  gurmukhi: string,
  target: string,
}

const fullWordMatches = ( query: string ) => ( { target, gurmukhi }: MatchOptions ) => {
  // Remove vishraams to prevent query from not matching
  const baseGurmukhi = stripVishraams( gurmukhi )
  // Remove vishraams from target to prevent vishraams in output
  const baseTarget = stripVishraams( target )

  // Trailing spaces can cause mismatches
  const sanitisedQuery = query.trim()

  // Find the match position, and then backtrack to find the beginning of the word
  const foundPosition = baseGurmukhi.search( sanitisedQuery )
  const matchStartPosition = baseGurmukhi.lastIndexOf( ' ', foundPosition )

  // Search forward to find the end of the match
  const wordEndPosition = baseGurmukhi.indexOf( ' ', foundPosition + sanitisedQuery.length )
  // If the match finishes in the last word, no space will be detected, and wordEndPosition
  // will be -1. In this case, we want to end at the last position in the line.
  const matchEndPosition = wordEndPosition === -1 ? baseGurmukhi.length - 1 : wordEndPosition

  // Grab the start index and length of the entire matching words
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

const firstLetterMatches = ( query: string ) => ( { target, gurmukhi }: MatchOptions ) => {
  // Remove vishraams to prevent query from not matching
  const baseGurmukhi = stripVishraams( gurmukhi )
  // Remove vishraams from target to prevent vishraams in output
  const baseLine = stripVishraams( target )

  // Get only letters, so that simple first letters can be matched
  const letters = toAscii( firstLetters( stripAccents( toUnicode( baseGurmukhi ) ) ) )
  const words = baseLine.split( ' ' )

  // Find the start and end positions of the match, including the entire end word
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

const UNDERSCORE_REGEX = /_/g

type SearchMode = ( typeof SEARCH_TYPES )[keyof typeof SEARCH_TYPES]

const getHighlighter = ( searchQuery: string, searchMode: SearchMode ) => ( context: Omit<MatchOptions, 'target'> ) => ( target: string ) => {
  if ( !target ) return [ '', '', '' ]

  // Account for wildcard characters
  const sanitizedQuery = searchQuery.replace( UNDERSCORE_REGEX, '.' )

  // Select the right highlighter
  const highlight = highlighters[ searchMode ]

  return highlight( sanitizedQuery )( { target, ...context } )
}

export default getHighlighter
