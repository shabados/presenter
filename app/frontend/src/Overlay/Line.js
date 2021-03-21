/* eslint-disable react/no-array-index-key */
import React from 'react'
import { string, bool, objectOf, func } from 'prop-types'
import classNames from 'classnames'

import { LANGUAGE_NAMES, TRANSLATION_ORDER, TRANSLITERATION_ORDER } from '../lib/data'
import { partitionLine, classifyWords } from '../lib/line'

import './Line.css'

const sortBy = sorter => ( [ n1 ], [ n2 ] ) => sorter[ n1 ] - sorter[ n2 ]

/**
 * Overlay Line Component.
 * Renders the various aspects of a single line.
 */
const Line = ( {
  className,
  gurmukhi,
  larivaarGurbani: larivaar,
  larivaarAssist,
  translations,
  transliterators,
} ) => (
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

Line.propTypes = {
  className: string,
  gurmukhi: string.isRequired,
  translations: objectOf( string ).isRequired,
  transliterators: objectOf( func ).isRequired,
  larivaarGurbani: bool,
  larivaarAssist: bool,
}

Line.defaultProps = {
  className: null,
  larivaarAssist: false,
  larivaarGurbani: false,
}

export default Line
