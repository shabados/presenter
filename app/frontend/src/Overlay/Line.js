/* eslint-disable react/no-array-index-key */
import React from 'react'
import { string, bool, oneOfType } from 'prop-types'
import classNames from 'classnames'

import { partitionLine, classifyWords } from '../lib/utils'

import './Line.css'

const isNonEmptyString = ( [ , arg ] ) => typeof arg === 'string' && !!arg

/**
 * Overlay Line Component.
 * Renders the various aspects of a single line.
 * @param {string} className An optional class name to append.
 * @param {string} gurmukhi The Gurmukhi of the line to render.
 * @param {string} punjabiTranslation The Punjabi translation of the line to render.
 * @param {string} englishTranslation The English translation of the line to render.
 * @param {string} transliteration The English transliteration of the line to render.
 */
const Line = ( {
  className,
  gurmukhi,
  larivaarGurbani: larivaar,
  larivaarAssist,
  punjabiTranslation,
  englishTranslation,
  spanishTranslation,
  englishTransliteration,
  hindiTransliteration,
  urduTransliteration,
} ) => {
  const line = partitionLine( gurmukhi )
    .map( ( line, lineIndex ) => (
      <span key={lineIndex}>
        {line.map( ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={classNames( type, 'word' )}>{word}</span> )}
      </span>
    ) )

  const translations = [
    [ 'english', englishTranslation ],
    [ 'punjabi', punjabiTranslation ],
    [ 'spanish', spanishTranslation ],
  ]

  const transliterations = [
    [ 'english', englishTransliteration ],
    [ 'hindi', hindiTransliteration ],
    [ 'urdu', urduTransliteration ],
  ]

  return (
    <div className={classNames( className, {
      larivaar,
      assist: larivaar && larivaarAssist,
    }, 'overlay-line' )}
    >
      <p className="gurmukhi">
        <span className="text">
          {line}
        </span>
      </p>

      {translations.filter( isNonEmptyString ).map( ( [ name, translation ] ) => (
        <p key={`${name}-${translation}`} className={classNames( name, 'translation' )}>
          <span className="text">
            {translation}
          </span>
        </p>
      ) )}

      {transliterations.filter( isNonEmptyString ).map( ( [ name, transliteration ] ) => (
        <p key={`${name}-${transliteration}`} className={classNames( name, 'transliteration' )}>
          <span className="text">
            {classifyWords( transliteration, true ).map(
              ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={classNames( type, 'word' )}>{word}</span>,
            )}
          </span>
        </p>
      ) )}

    </div>
  )
}

Line.propTypes = {
  className: string,
  gurmukhi: string.isRequired,
  punjabiTranslation: oneOfType( [ string, bool ] ),
  englishTranslation: oneOfType( [ string, bool ] ),
  spanishTranslation: oneOfType( [ string, bool ] ),
  englishTransliteration: oneOfType( [ string, bool ] ),
  hindiTransliteration: oneOfType( [ string, bool ] ),
  urduTransliteration: oneOfType( [ string, bool ] ),
  larivaarGurbani: bool,
  larivaarAssist: bool,
}

Line.defaultProps = {
  className: null,
  larivaarAssist: false,
  larivaarGurbani: false,
  englishTranslation: false,
  spanishTranslation: false,
  punjabiTranslation: false,
  englishTransliteration: false,
  hindiTransliteration: false,
  urduTransliteration: false,
}

export default Line
