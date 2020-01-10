/* eslint-disable react/no-array-index-key */
import React from 'react'
import { string } from 'prop-types'
import classNames from 'classnames'

import { partitionLine, classifyWords } from '../lib/utils'

import './Line.css'

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
    <div className={classNames( className, { empty: gurmukhi }, 'overlay-line' )}>
      <p className="gurmukhi larivaar">{line}</p>
      <p className="gurmukhi">{line}</p>

      {translations.map( ( [ name, translation ] ) => (
        <p key={`${name}-${translation}`} className={classNames( name, 'translation' )}>
          {translation}
        </p>
      ) )}

      {transliterations.map( ( [ name, transliteration ] ) => (
        <p key={`${name}-${transliteration}`} className={classNames( name, 'transliteration' )}>
          {classifyWords( transliteration, true ).map(
            ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={classNames( type, 'word' )}>{word}</span>,
          )}
        </p>
      ) )}

    </div>
  )
}

Line.propTypes = {
  className: string,
  gurmukhi: string.isRequired,
  punjabiTranslation: string,
  englishTranslation: string,
  spanishTranslation: string,
  englishTransliteration: string,
  hindiTransliteration: string,
  urduTransliteration: string,
}

Line.defaultProps = {
  className: null,
  englishTranslation: '',
  spanishTranslation: '',
  punjabiTranslation: '',
  englishTransliteration: '',
  hindiTransliteration: '',
  urduTransliteration: '',
}

export default Line
