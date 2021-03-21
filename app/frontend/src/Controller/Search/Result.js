import React, { forwardRef, useContext } from 'react'
import { string, number, shape, bool, func, arrayOf } from 'prop-types'
import classNames from 'classnames'
import { ListItem } from '@material-ui/core'

import controller from '../../lib/controller'
import { WritersContext, RecommendedSourcesContext, SettingsContext } from '../../lib/contexts'
import { LANGUAGE_NAMES, SOURCE_ABBREVIATIONS, TRANSLITERATORS } from '../../lib/consts'
import { customiseLine, getTranslation } from '../../lib/line'

/**
 * Renders a single result, highlighting the match.
 * @param {string} gurmukhi The shabad line to display.
 * @param {int} typeId The type id of line.
 * @param {string} lineId The id of the line.
 * @param {string} shabadId The id of the shabad.
 * @param {int} sourceId The id of source.
 * @param {Object} shabad The object containing section information and other metadata.
 * @param {Boolean} focused Whether the line is focused or not.
 * @param {Function} highlighter The match highlighter.
 * @param {int} sourcePage The page number of shabad in source.
 * @param {string} translations The translations of shabad line to display.
 * @param {string} transliterations The transliterations of shabad line to display.
 */
const Result = forwardRef( ( {
  gurmukhi,
  typeId,
  id: lineId,
  shabadId,
  sourceId,
  shabad,
  focused,
  highlighter,
  sourcePage,
  translations,
}, ref ) => {
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

  const transliteration = resultTransliterationLanguage && customiseLine(
    TRANSLITERATORS[ resultTransliterationLanguage ]( gurmukhi ),
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

  // Separate the line into words before the match, the match, and after the match
  const highlight = highlighter( { gurmukhi } )
  const [ beforeMatch, match, afterMatch ] = highlight( gurmukhi )
  const [ translitBeforeMatch, translitMatch, translitAfterMatch ] = highlight( transliteration )

  // Send the shabad id and line id to the server on click
  const onClick = () => controller.shabad( { shabadId, lineId } )

  // Helper render functions for citation
  const showCitation = showResultCitations && shabad && shabad.section
  const getEnglish = ( { nameEnglish } ) => nameEnglish
  const getWriterName = () => getEnglish( writers[ shabad.writerId ] )
  const getPageName = () => recommendedSources[ shabad.sourceId ].pageNameEnglish

  return (
    <ListItem ref={ref} className={classNames( { focused } )} onClick={onClick}>
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
} )

Result.propTypes = {
  gurmukhi: string.isRequired,
  id: string.isRequired,
  typeId: number.isRequired,
  shabadId: string.isRequired,
  focused: bool.isRequired,
  highlighter: func.isRequired,
  sourceId: number.isRequired,
  shabad: shape( { } ).isRequired,
  sourcePage: number.isRequired,
  translations: arrayOf( shape( { translation: string.isRequired } ) ).isRequired,
}

export default Result
