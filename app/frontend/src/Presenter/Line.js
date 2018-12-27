/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react'
import { string, boolean } from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'

import { partitionLine } from '../lib/utils'
import { DEFAULT_OPTIONS } from '../lib/consts'

import './Line.css'

/**
 * Line Component.
 * Renders the various aspects of a single line.
 * @param {String} gurmukhi The Gurmukhi of the line to render.
 * @param {String} punjabi The Punjabi of the line to render.
 * @param {String} translation The English translation of the line to render.
 * @param {String} transliteration The English transliteration of the line to render.
 * @param {String} spacing The justify content value for spacing between the lines.
 * @param {Boolean} larivaarGurbani Whether Gurbani should be continuous or not.
 * @param {Boolean} larivaarAssist If `larivaarGurbani`, whether alternate words should be coloured.
 */
const Line = ( {
  gurmukhi,
  punjabi,
  translation,
  transliteration,
  spacing,
  larivaarGurbani: larivaar,
  larivaarAssist,
} ) => (
  <div className="line" style={{ justifyContent: spacing }}>
    <p className={classNames( 'gurmukhi', { larivaar, assist: larivaar && larivaarAssist } )}>
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
  larivaarGurbani: boolean,
  larivaarAssist: boolean,
}

Line.defaultProps = {
  spacing: DEFAULT_OPTIONS.local.layout.spacing.value,
  larivaarGurbani: DEFAULT_OPTIONS.local.layout.larivaarGurbani,
  larivaarAssist: DEFAULT_OPTIONS.local.layout.larivaarGurbaniAssist,
}

export default Line
