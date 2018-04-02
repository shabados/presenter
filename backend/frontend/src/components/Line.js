/* eslint-disable react/no-array-index-key */
import React from 'react'
import PropTypes from 'prop-types'

import { partitionLine } from '../lib/utils'

import './Line.css'

/**
 * Line Component.
 * Renders the various aspects of a single line.
 * @param gurmukhi The Gurmukhi of the line to render.
 * @param punjabi The Punjabi of the line to render.
 * @param translation The English translation of the line to render.
 * @param transliteration The English transliteration of the line to render.
 */
const Line = ( { gurmukhi, punjabi, translation, transliteration } ) => (
  <div className="line">
    <p className="gurmukhi">
      {partitionLine( gurmukhi )
        .map( ( line, i ) => (
          <span key={i} className="partition">
            {line.map( ( { word, type }, i ) => <span key={i} className={type}>{word}</span> )}
          </span>
        ) )}
    </p>
    <p className="translation">{translation}</p>
    <p className="punjabi">{punjabi}</p>
    <p className="transliteration">{transliteration}</p>
  </div>
)

Line.propTypes = {
  gurmukhi: PropTypes.string.isRequired,
  punjabi: PropTypes.string.isRequired,
  translation: PropTypes.string.isRequired,
  transliteration: PropTypes.string.isRequired,
}

export default Line
