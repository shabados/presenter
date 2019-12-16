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
  transliteration,
} ) => {
  const line = partitionLine( gurmukhi )
    .map( ( line, lineIndex ) => (
      <span key={lineIndex}>
        {line.map( ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={classNames( type, 'word' )}>{word}</span> )}
      </span>
    ) )

  return (
    <div className={classNames( className, { empty: gurmukhi }, 'overlay-line' )}>
      <p className="gurmukhi larivaar">{line}</p>
      <p className="gurmukhi">{line}</p>
      <p className="english translation">{englishTranslation}</p>
      <p className="punjabi translation">{punjabiTranslation}</p>
      <p className="english transliteration">
        {
          classifyWords( transliteration )
            .map( ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={classNames( type, 'word' )}>{word}</span> )
        }
      </p>
    </div>
  )
}

Line.propTypes = {
  className: string,
  gurmukhi: string.isRequired,
  punjabiTranslation: string,
  englishTranslation: string,
  transliteration: string,
}

Line.defaultProps = {
  className: null,
  englishTranslation: '',
  punjabiTranslation: '',
  transliteration: '',
}

export default Line
