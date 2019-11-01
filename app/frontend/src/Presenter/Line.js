/* eslint-disable react/no-array-index-key */
import React from 'react'
import { string, bool, number, oneOfType } from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'

import { partitionLine, classifyWords } from '../lib/utils'
import { DEFAULT_OPTIONS } from '../lib/consts'

import './Line.css'

/**
 * Line Component.
 * Renders the various aspects of a single line.
 * @param {string} className An optional class name to append.
 * @param {string} gurmukhi The Gurmukhi of the line to render.
 * @param {string} punjabiTranslation The Punjabi translation of the line to render.
 * @param {string} englishTranslation The English translation of the line to render.
 * @param {string} transliteration The English transliteration of the line to render.
 * @param {string} spacing The justify content value for spacing between the lines.
 * @param {number} fontSize The global font size of presenter lines.
 * @param {number} relativeGurmukhiFontSize The relative font size for the gurmukhi ascii font.
 * @param {number} relativeEnglishFontSize The relative font size for the english font.
 * @param {number} relativePunjabiFontSize The relative font size for the punjabi unicode font.
 * @param {boolean} larivaarGurbani Whether Gurbani should be continuous or not.
 * @param {boolean} larivaarAssist If `larivaarGurbani`, whether alternate words should be coloured.
 * @param {boolean} vishraamColors Enables colors for vishraams.
 * @param {boolean} vishraamTransliterationColors Enables colors for vishraams in transliteration.
 * @param {boolean} vishraamCharacters Enables display of vishraam characters.
 * @param {boolean} vishraamLight Enables colors for light vishraams.
 * @param {boolean} vishraamMedium Enables colors for medium vishraams.
 * @param {boolean} vishraamHeavy Enables colors for heavy vishraams.
 * @param {boolean} splitOnVishraam If the line is too long, split it on the vishraam word.
 * @param {boolean} simpleGraphics Disables transitions and other intensive effects.
 */
const Line = ( {
  className,
  gurmukhi,
  punjabiTranslation,
  englishTranslation,
  transliteration,
  spacing,
  fontSize,
  relativeGurmukhiFontSize,
  relativeEnglishFontSize,
  relativePunjabiFontSize,
  larivaarGurbani: larivaar,
  larivaarAssist,
  vishraamColors: vishraams,
  vishraamTransliterationColors,
  vishraamCharacters,
  vishraamLight,
  vishraamMedium,
  vishraamHeavy,
  splitOnVishraam: partition,
  simpleGraphics: simple,
} ) => (
  <div
    className={classNames( className, {
      assist: larivaar && larivaarAssist,
      light: vishraams && vishraamLight,
      medium: vishraams && vishraamMedium,
      heavy: vishraams && vishraamHeavy,
      vishraams,
      larivaar,
      simple,
    }, 'line' )}
    style={{ justifyContent: spacing, fontSize: `${fontSize}Vh` }}
  >
    <TransitionGroup appear exit={false} component={null}>

      <CSSTransition key={gurmukhi} classNames="fade" timeout={0}>
        <p
          className="gurmukhi"
          style={{ fontSize: `${relativeGurmukhiFontSize}em` }}
        >
          {partitionLine( gurmukhi, !vishraamCharacters )
            .map( ( line, lineIndex ) => (
              <span key={lineIndex} className={classNames( { partition } )}>
                {line.map( ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={classNames( type, 'word' )}>{word}</span> )}
              </span>
            ) )}

        </p>
      </CSSTransition>

      {englishTranslation && (
      <CSSTransition key={englishTranslation} classNames="fade" timeout={0}>
        <p
          className="english translation"
          style={{ fontSize: `${relativeEnglishFontSize}em` }}
        >
          {englishTranslation}
        </p>
      </CSSTransition>
      )}

      {punjabiTranslation
      && (
      <CSSTransition key={punjabiTranslation} classNames="fade" timeout={0}>
        <p
          className="punjabi translation"
          style={{ fontSize: `${relativePunjabiFontSize}em` }}
        >
          {punjabiTranslation}
        </p>
      </CSSTransition>
      )}

      {transliteration
      && (
      <CSSTransition key={`${transliteration}`} classNames="fade" timeout={0}>
        <p
          className={classNames( { vishraams: vishraams && vishraamTransliterationColors }, 'english transliteration' )}
          style={{ fontSize: `${relativeEnglishFontSize}em` }}
        >
          {
          classifyWords( transliteration, !vishraamCharacters )
            .map( ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={classNames( type, 'word' )}>{word}</span> )
        }
        </p>
      </CSSTransition>
      )}

    </TransitionGroup>
  </div>
)

Line.propTypes = {
  className: string,
  gurmukhi: string.isRequired,
  punjabiTranslation: oneOfType( [ string, bool ] ),
  englishTranslation: oneOfType( [ string, bool ] ),
  transliteration: oneOfType( [ string, bool ] ),
  spacing: string,
  larivaarGurbani: bool,
  larivaarAssist: bool,
  vishraamColors: bool,
  vishraamTransliterationColors: bool,
  vishraamCharacters: bool,
  vishraamLight: bool,
  vishraamMedium: bool,
  vishraamHeavy: bool,
  splitOnVishraam: bool,
  simpleGraphics: bool,
  fontSize: number,
  relativeGurmukhiFontSize: number,
  relativeEnglishFontSize: number,
  relativePunjabiFontSize: number,
}

const {
  layout: {
    spacing,
    larivaarAssist,
    larivaarGurbani,
    vishraamColors,
    vishraamTransliterationColors,
    vishraamCharacters,
    vishraamHeavy,
    vishraamMedium,
    vishraamLight,
    splitOnVishraam,
    fontSize,
    relativeGurmukhiFontSize,
    relativeEnglishFontSize,
    relativePunjabiFontSize,
  },
  theme: {
    simpleGraphics,
  },
} = DEFAULT_OPTIONS.local

Line.defaultProps = {
  className: null,
  englishTranslation: null,
  punjabiTranslation: null,
  transliteration: null,
  spacing,
  larivaarGurbani,
  larivaarAssist,
  vishraamColors,
  vishraamTransliterationColors,
  vishraamCharacters,
  vishraamHeavy,
  vishraamMedium,
  vishraamLight,
  splitOnVishraam,
  simpleGraphics,
  fontSize,
  relativeGurmukhiFontSize,
  relativeEnglishFontSize,
  relativePunjabiFontSize,
}

export default Line
