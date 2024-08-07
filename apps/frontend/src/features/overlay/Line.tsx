/* eslint-disable react/no-array-index-key */
import './Line.css'

import classNames from 'classnames'

import { LANGUAGE_NAMES, TRANSLATION_ORDER, Translations, TRANSLITERATION_ORDER, Transliterators } from '../lib/data'
import { classifyWords, partitionLine, sortBy } from '../lib/line'

type LineProps = {
  className?: string,
  gurmukhi: string,
  translations: Translations,
  transliterators: Transliterators,
  larivaarGurbani?: boolean,
  larivaarAssist?: boolean,
}
/**
 * Overlay Line Component.
 * Renders the various aspects of a single line.
 */
const Line = ( {
  className = '',
  gurmukhi,
  larivaarGurbani: larivaar = false,
  larivaarAssist = false,
  translations,
  transliterators,
}: LineProps ) => (
  <div className={classNames( className, {
    larivaar,
    assist: larivaar && larivaarAssist,
  }, 'overlay-line' )}
  >
    <p className="gurmukhi">
      <span className="text">
        {partitionLine( gurmukhi )
          .map( ( line, lineIndex ) => (
            <span key={lineIndex}>
              {line.map( ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={classNames( type, 'word' )}>{word}</span> )}
            </span>
          ) )}
      </span>
    </p>

    {Object
      .entries( translations )
      .sort( sortBy( TRANSLATION_ORDER ) )
      .map( ( [ languageId, translation ] ) => (
        <p key={`${gurmukhi}-${languageId}-translation`} className={classNames( LANGUAGE_NAMES[ languageId ], 'translation' )}>
          <span className="text">
            {translation}
          </span>
        </p>
      ) )}

    {Object
      .entries( transliterators )
      .sort( sortBy( TRANSLITERATION_ORDER ) )
      .map( ( [ languageId, transliterate ] ) => (
        <p key={`${gurmukhi}-${languageId}-transliteration`} className={classNames( LANGUAGE_NAMES[ languageId ], 'transliteration' )}>
          <span className="text">
            {classifyWords( transliterate( gurmukhi ), true ).map(
              ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={classNames( type, 'word' )}>{word}</span>,
            )}
          </span>
        </p>
      ) )}

  </div>
)

export default Line
