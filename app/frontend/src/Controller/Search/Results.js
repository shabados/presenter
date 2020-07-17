import React, { useContext } from 'react'
import classNames from 'classnames'
import { ListItem, List } from '@material-ui/core'
import { string, oneOfType, number, instanceOf, shape, arrayOf, func } from 'prop-types'
import { firstLetters, stripVishraams, stripAccents, toUnicode, toAscii } from 'gurmukhi-utils'

import controller from '../../lib/controller'
import { getTranslation, getTransliteration, customiseLine } from '../../lib/utils'
import { WritersContext, RecommendedSourcesContext, SettingsContext } from '../../lib/contexts'
import { SEARCH_TYPES, LANGUAGE_NAMES, SEARCH_ANCHORS, SOURCE_ABBREVIATIONS } from '../../lib/consts'

const highlightFullWordMatches = ( line, query ) => {
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

const highlightFirstLetterMatches = ( line, query ) => {
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
    ? highlightFullWordMatches( gurmukhi, sanitizedInput )
    : highlightFirstLetterMatches( value, sanitizedInput )
}

const Result = ( { results, searchedValue, anchor, register, focused } ) => {
  const { local: {
    sources,
    search: {
      showResultCitations,
      resultTransliterationLanguage,
      resultTranslationLanguage,
      lineEnding,
    },
  } = {} } = useContext( SettingsContext )

  const writers = useContext( WritersContext )
  const recommendedSources = useContext( RecommendedSourcesContext )

  /**
   * Renders a single result, highlighting the match.
   * @param {string} gurmukhi The shabad line to display.
   * @param {int} typeId The type id of line.
   * @param {string} lineId The id of the line.
   * @param {string} shabadId The id of the shabad.
   * @param {Component} ref The ref to the component.
   * @param {int} sourceId The id of source.
   * @param {Object} shabad The object containng section information and other metadata.
   * @param {int} sourcePage The page number of shabad in source.
   * @param {string} translations The translations of shabad line to display.
   * @param {string} transliterations The transliterations of shabad line to display.
   */
  const ResultList = ( {
    gurmukhi,
    typeId,
    id: lineId,
    shabadId,
    ref,
    sourceId,
    shabad,
    sourcePage,
    translations,
    transliterations,
  } ) => {
    const transliteration = resultTransliterationLanguage && transliterations && customiseLine(
      getTransliteration(
        { transliterations },
        resultTransliterationLanguage,
      ),
      { lineEnding, typeId },
    )

    const translation = resultTranslationLanguage && translations && customiseLine(
      getTranslation( {
        line: { translations },
        shabad: { sourceId },
        recommendedSources,
        sources,
        languageId: resultTranslationLanguage,
      } ),
      { lineEnding, typeId },
    )

    // Grab the search mode or assume it's first letter
    const mode = SEARCH_ANCHORS[ anchor ] || SEARCH_TYPES.firstLetter

    // Separate the line into words before the match, the match, and after the match
    const getMatches = highlightMatches( gurmukhi )

    const [ beforeMatch, match, afterMatch ] = getMatches(
      gurmukhi,
      searchedValue,
      mode,
    )
    const [ translitBeforeMatch, translitMatch, translitAfterMatch ] = getMatches(
      transliteration,
      searchedValue,
      mode,
    )

    // Send the shabad id and line id to the server on click
    const onClick = () => controller.shabad( { shabadId, lineId } )

    // Helper render functions for citation
    const showCitation = showResultCitations && shabad && shabad.section
    const getEnglish = ( { nameEnglish } ) => nameEnglish
    const getWriterName = () => getEnglish( writers[ shabad.writerId ] )
    const getPageName = () => recommendedSources[ shabad.sourceId ].pageNameEnglish

    return (
      <ListItem className={classNames( { focused } )} key={lineId} onClick={onClick} ref={ref}>
        <div className="result">

          <span className="gurmukhi text">
            {beforeMatch ? <span className="words">{beforeMatch}</span> : null}
            {match ? <span className="matched words">{match}</span> : null}
            {afterMatch ? <span className="words">{afterMatch}</span> : null}
          </span>

          <span className="secondary text">

            {translation && (
            <div className={classNames( LANGUAGE_NAMES[ resultTranslationLanguage ], 'translation' )}>
              {translation}
            </div>
            )}

            {transliteration && (
            <div className={classNames( LANGUAGE_NAMES[ resultTransliterationLanguage ], 'transliteration' )}>
              {translitBeforeMatch ? <span className="translit">{translitBeforeMatch}</span> : null}
              {translitMatch ? <span className="translit matched">{translitMatch}</span> : null}
              {translitAfterMatch ? <span className="translit">{translitAfterMatch}</span> : null}
            </div>
            )}

          </span>

          {showCitation && (
          <span className="citation">
            {[
              getWriterName(),
              SOURCE_ABBREVIATIONS[ sourceId ],
              `${getPageName()} ${sourcePage}`,
            ].reduce( ( prev, curr ) => [ prev, ' - ', curr ] )}
          </span>
          )}

        </div>
      </ListItem>
    )
  }

  ResultList.propTypes = {
    gurmukhi: string.isRequired,
    id: string.isRequired,
    typeId: string.isRequired,
    shabadId: string.isRequired,
    ref: instanceOf( Result ).isRequired,
    sourceId: number.isRequired,
    shabad: shape( { } ).isRequired,
    sourcePage: number.isRequired,
    translations: string.isRequired,
    transliterations: string.isRequired,
  }

  return (
    <List className="results">
      {results
        ? results.map( ( props, i ) => ResultList( {
          ...props,
          ref: c => register( i, c ),
          focused: focused === i,
        } ) )
        : ''}
    </List>
  )
}

Result.propTypes = {
  results: arrayOf( shape( {} ) ),
  searchedValue: string,
  anchor: string,
  register: func.isRequired,
  focused: oneOfType( [ string, number ] ),
}

Result.defaultProps = {
  results: [],
  searchedValue: undefined,
  anchor: undefined,
  focused: undefined,
}

export default Result
