/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react'
import { string } from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { partitionLine } from '../lib/utils'
import { DEFAULT_OPTIONS } from '../lib/consts'

import './Line.css'

/**
 * Line Component.
 * Renders the various aspects of a single line.
 * @param gurmukhi The Gurmukhi of the line to render.
 * @param punjabi The Punjabi of the line to render.
 * @param translation The English translation of the line to render.
 * @param transliteration The English transliteration of the line to render.
 */
const Line = ( { gurmukhi, punjabi, translation, transliteration, spacing } ) => (
  <div className="line" style={{ justifyContent: spacing }}>
    <p className="gurmukhi">
      {partitionLine( gurmukhi )
        .map( ( line, i ) => (
          <span key={i} className="partition">
            {line.map( ( { word, type }, i ) => <span key={i} className={type}>{word}</span> )}
          </span>
        ) )}
    </p>
    <TransitionGroup appear exit={false} component={Fragment}>
      <CSSTransition key={translation} classNames="fade" timeout={100}>
        <p className="translation">{translation}</p>
      </CSSTransition>
      <CSSTransition key={punjabi} classNames="fade" timeout={150}>
        <p className="punjabi">{punjabi}</p>
      </CSSTransition>
      <CSSTransition key={transliteration} classNames="fade" timeout={200}>
        <p className="transliteration">{transliteration}</p>
      </CSSTransition>
    </TransitionGroup>
  </div>
)

Line.propTypes = {
  gurmukhi: string.isRequired,
  punjabi: string.isRequired,
  translation: string.isRequired,
  transliteration: string.isRequired,
  spacing: string,
}

Line.defaultProps = {
  spacing: DEFAULT_OPTIONS.local.layout.spacing.value,
}

export default Line
