import React, { useContext } from 'react'
import classNames from 'classnames'
import { ListItem, List } from '@material-ui/core'
import { string, oneOfType, number, instanceOf, shape, arrayOf, func } from 'prop-types'

import controller from '../../lib/controller'
import { getTranslation, getTransliteration, customiseLine } from '../../lib/utils'
import { WritersContext, RecommendedSourcesContext, SettingsContext } from '../../lib/contexts'
import { SEARCH_TYPES, LANGUAGE_NAMES, SEARCH_ANCHORS, SOURCE_ABBREVIATIONS } from '../../lib/consts'

import highlightMatches from './highlight-matches'

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
            {beforeMatch && <span className="words">{beforeMatch}</span>}
            {match && <span className="matched words">{match}</span>}
            {afterMatch && <span className="words">{afterMatch}</span>}
          </span>

          <span className="secondary text">
            {translation && (
              <div className={classNames( LANGUAGE_NAMES[ resultTranslationLanguage ], 'translation' )}>
                {translation}
              </div>
            )}

            {transliteration && (
              <div className={classNames( LANGUAGE_NAMES[ resultTransliterationLanguage ], 'transliteration' )}>
                {translitBeforeMatch && <span className="translit">{translitBeforeMatch}</span>}
                {translitMatch && <span className="translit matched">{translitMatch}</span>}
                {translitAfterMatch && <span className="translit">{translitAfterMatch}</span>}
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
