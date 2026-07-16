import React, { forwardRef, useContext } from 'react'
import { string, number, shape, bool, func, arrayOf } from 'prop-types'
import classNames from 'classnames'

import controller from '../../../lib/controller'
import { WritersContext, RecommendedSourcesContext, SettingsContext } from '../../../lib/contexts'
import { LANGUAGE_NAMES, SOURCE_ABBREVIATIONS, TRANSLITERATORS } from '../../../lib/data'
import { customiseLine, getTranslation } from '../../../lib/line'

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

  const highlight = highlighter( { gurmukhi } )
  const [ beforeMatch, match, afterMatch ] = highlight( gurmukhi )
  const [ translitBeforeMatch, translitMatch, translitAfterMatch ] = highlight( transliteration )

  const onClick = () => controller.shabad( { shabadId, lineId } )

  const showCitation = showResultCitations && shabad && shabad.section
  const getEnglish = ( { nameEnglish } ) => nameEnglish
  const getWriterName = () => getEnglish( writers[ shabad.writerId ] )
  const getPageName = () => recommendedSources[ shabad.sourceId ].pageNameEnglish

  return (
    <li ref={ref} className={classNames( { focused } )} onClick={onClick}>
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
    </li>
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
