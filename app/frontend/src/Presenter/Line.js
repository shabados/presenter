/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react'
import { string, boolean } from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'

import { partitionLine, classifyWords } from '../lib/utils'
import { DEFAULT_OPTIONS } from '../lib/consts'

import './Line.css'

/**
 * Line Component.
 * Renders the various aspects of a single line.
 * @param {String} gurmukhi The Gurmukhi of the line to render.
 * @param {String} punjabiTranslation The Punjabi translation of the line to render.
 * @param {String} englishTranslation The English translation of the line to render.
 * @param {String} transliteration The English transliteration of the line to render.
 * @param {String} spacing The justify content value for spacing between the lines.
 * @param {Boolean} larivaarGurbani Whether Gurbani should be continuous or not.
 * @param {Boolean} larivaarAssist If `larivaarGurbani`, whether alternate words should be coloured.
 * @param {Boolean} splitOnVishraam If the line is too long, split it on the vishraam word.
 * @param {Boolean} simpleGraphics Disables transitions and other intensive effects.
 */
const Line = ( {
  gurmukhi,
  punjabiTranslation,
  englishTranslation,
  transliteration,
  spacing,
  larivaarGurbani: larivaar,
  larivaarAssist,
  splitOnVishraam: partition,
  simpleGraphics: simple,
} ) => (
  <div className={classNames( { simple, larivaar, assist: larivaar && larivaarAssist }, 'line' )} style={{ justifyContent: spacing }}>
    <p className="gurmukhi">
      {partitionLine( gurmukhi )
        .map( ( line, i ) => (
          <span key={i} className={classNames( { partition } )}>
            {line.map( ( { word, type }, i ) => <span key={i} className={classNames( type, 'word' )}>{word}</span> )}
          </span>
        ) )}
    </p>
    <TransitionGroup appear exit={false} component={Fragment}>
      {englishTranslation &&
      <CSSTransition key={englishTranslation} classNames="fade" timeout={100}>
        <p className="english translation">{englishTranslation}</p>
      </CSSTransition>}
      {punjabiTranslation &&
      <CSSTransition key={punjabiTranslation} classNames="fade" timeout={150}>
        <p className="punjabi translation">{punjabiTranslation}</p>
      </CSSTransition>}
      {transliteration &&
      <CSSTransition key={transliteration} classNames="fade" timeout={200}>
        <p className="transliteration">{
          classifyWords( transliteration )
          .map( ( { word, type }, i ) => <span key={i} className={classNames( type, 'word' )}>{word}</span> )
        }
        </p>
      </CSSTransition>}
    </TransitionGroup>
  </div>
)

Line.propTypes = {
  gurmukhi: string.isRequired,
  punjabiTranslation: string,
  englishTranslation: string,
  transliteration: string,
  spacing: string,
  larivaarGurbani: boolean,
  larivaarAssist: boolean,
  splitOnVishraam: boolean,
  simpleGraphics: boolean,
}

const {
  layout: {
    spacing,
    larivaarAssist,
    larivaarGurbani,
    splitOnVishraam,
  },
  theme: {
    simpleGraphics,
  },
} = DEFAULT_OPTIONS.local

Line.defaultProps = {
  englishTranslation: null,
  punjabiTranslation: null,
  transliteration: null,
  spacing,
  larivaarGurbani,
  larivaarAssist,
  splitOnVishraam,
  simpleGraphics,
}

export default Line
