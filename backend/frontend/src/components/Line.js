/* eslint-disable react/no-array-index-key */
import React from 'react'

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
const Line = ( { gurmukhi, punjabi, translation, transliteration } ) => {
  return (
    <div className="line">
      <p className="gurmukhi">
        {partitionLine( gurmukhi )
          .map( line => (
            <span className="partition">
              {line.map( ( { word, type }, i ) => <span key={i} className={type}>{word}</span> )}
            </span>
          ) )}
      </p>
      <p className="translation">{translation}</p>
      <p className="punjabi">{punjabi}</p>
      <p className="transliteration">{transliteration}</p>
    </div>
  )
}

export default Line
