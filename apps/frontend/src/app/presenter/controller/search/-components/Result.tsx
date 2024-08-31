import { ListItem } from '@mui/material'
import classNames from 'classnames'
import { forwardRef, useContext } from 'react'

import { RecommendedSourcesContext, SettingsContext, WritersContext } from '~/helpers/contexts'
import { LANGUAGE_NAMES, SOURCE_ABBREVIATIONS, TRANSLITERATORS } from '~/helpers/data'
import { customiseLine, getTranslation } from '~/helpers/line'
import controller from '~/services/controller'

type ResultProps = {
  gurmukhi: string,
  id: string,
  typeId: number,
  shabadId: string,
  focused: boolean,
  highlighter: ( {}: { gurmukhi: string } ) => any,
  sourceId: number,
  shabad: Record<string, any>,
  sourcePage: number,
  translations: Record<string, string>[],
}


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
}: ResultProps, ref ) => {
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
  const showCitation = showResultCitations && shabad?.section
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

export default Result
