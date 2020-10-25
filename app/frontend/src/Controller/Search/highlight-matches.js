const { stripVishraams, toAscii, firstLetters, stripAccents, toUnicode } = require( 'gurmukhi-utils' )
const { SEARCH_TYPES } = require( '../../lib/consts' )

const fullWordMatches = ( line, query ) => {
  const sanitisedQuery = query.trim()

  const foundPosition = line.search( sanitisedQuery )
  const matchStartPosition = line.lastIndexOf( ' ', foundPosition )

  const wordEndPosition = line.indexOf( ' ', foundPosition + sanitisedQuery.length )
  // If the match finishes in the last word, no space will be deteced, and wordEndPosition
  // will be -1. In this case, we want to end at the last position in the line.
  const matchEndPosition = wordEndPosition === -1 ? line.length - 1 : wordEndPosition

  return [
    line.substring( 0, matchStartPosition ),
    line.substring( matchStartPosition, matchEndPosition ),
    line.substring( matchEndPosition ),
  ]
}

const firstLetterMatches = ( line, query ) => {
  const baseLine = stripVishraams( line )

  const letters = toAscii( firstLetters( stripAccents( toUnicode( baseLine ) ) ) )
  const words = baseLine.split( ' ' )

  const startPosition = letters.search( stripAccents( query ) )
  const endPosition = startPosition + query.length

  return [
    `${words.slice( 0, startPosition ).join( ' ' )} `,
    `${words.slice( startPosition, endPosition ).join( ' ' )} `,
    `${words.slice( endPosition ).join( ' ' )} `,
  ]
}

/**
 * Separates the line into words before the first match, the first match, and after the match.
 * @param value The full line.
 * @param input The string inputted by the user.
 * @param mode The type of search being performed, either first word or full word.
 * @return An array of [ beforeMatch, match, afterMatch ],
 *   with `match` being the highlighted section.`.
 */
const highlightMatches = gurmukhi => ( value, input, mode ) => {
  if ( !value ) return [ '', '', '' ]

  //  Account for wildcard characters
  const sanitizedInput = input.replace( new RegExp( '_', 'g' ), '.' )

  return mode === SEARCH_TYPES.fullWord
    ? fullWordMatches( gurmukhi, sanitizedInput )
    : firstLetterMatches( value, sanitizedInput )
}

export default highlightMatches
