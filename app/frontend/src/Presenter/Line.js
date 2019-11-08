/* eslint-disable react/no-array-index-key */
import React from 'react'
import { string, bool, number, oneOfType } from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'

import { partitionLine, classifyWords } from '../lib/utils'
import { DEFAULT_OPTIONS } from '../lib/options'

import './Line.css'

const isString = ( [ , arg ] ) => typeof arg === 'string'

/**
 * Line Component.
 * Renders the various aspects of a single line.
 * @param {string} className An optional class name to append.
 * @param {string} gurmukhi The Gurmukhi of the line to render.
 * @param {string} punjabiTranslation The Punjabi translation of the line to render.
 * @param {string} englishTranslation The English translation of the line to render.
 * @param {string} spanishTranslation The Spanish translation of the line to render.
 * @param {string} englishTransliteration The English transliteration of the line to render.
 * @param {string} hindiTransliteration The Hindi transliteration of the line to render.
 * @param {string} urduTransliteration The Urdu transliteration of the line to render.
 * @param {string} spacing The justify content value for spacing between the lines.
 * @param {boolean} centerText Whether to center text.
 * @param {boolean} justifyText Whether to justify (edge to edge) wrapped text (2+ lines long).
 * @param {number} presenterFontSize The global font size of presenter lines.
 * @param {number} relativeGurmukhiFontSize Relative size for gurmukhi ascii font.
 * @param {number} relativeEnglishFontSize Relative size for latin scripts (english/spanish).
 * @param {number} relativePunjabiFontSize Relative size for punjabi unicode font.
 * @param {number} relativeHindiFontSize Relative font size for hindi unicode font.
 * @param {number} relativeUrduFontSize Relative font size for urdu unicode font.
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
  spanishTranslation,
  englishTransliteration,
  hindiTransliteration,
  urduTransliteration,
  spacing,
  centerText,
  justifyText,
  presenterFontSize,
  relativeGurmukhiFontSize,
  relativeEnglishFontSize,
  relativePunjabiFontSize,
  relativeHindiFontSize,
  relativeUrduFontSize,
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
} ) => {
  const translations = [
    [ 'english', englishTranslation, relativeEnglishFontSize ],
    [ 'punjabi', punjabiTranslation, relativePunjabiFontSize ],
    [ 'spanish', spanishTranslation, relativeEnglishFontSize ],
  ]

  const transliterations = [
    [ 'english', englishTransliteration, relativeEnglishFontSize ],
    [ 'hindi', hindiTransliteration, relativeHindiFontSize ],
    [ 'urdu', urduTransliteration, relativeUrduFontSize ],
  ]

  return (
    <div
      className={classNames( className, {
        assist: larivaar && larivaarAssist,
        light: vishraams && vishraamLight,
        medium: vishraams && vishraamMedium,
        heavy: vishraams && vishraamHeavy,
        vishraams,
        larivaar,
        simple,
        'center-text': centerText,
        'justify-text': justifyText,
      }, 'line' )}
      style={{ justifyContent: spacing, fontSize: `${presenterFontSize}Vh` }}
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


        {translations.filter( isString ).map( ( [ name, translation, fontSize ] ) => (
          <CSSTransition key={translation} classNames="fade" timeout={0}>
            <p className={classNames( name, 'translation' )} style={{ fontSize: `${fontSize}em` }}>
              {translation}
            </p>
          </CSSTransition>
        ) )}

        {transliterations.filter( isString ).map( ( [ name, transliteration, fontSize ] ) => (
          <CSSTransition key={transliteration} classNames="fade" timeout={0}>
            <p
              className={classNames( { vishraams: vishraams && vishraamTransliterationColors }, name, 'transliteration' )}
              style={{ fontSize: `${fontSize}em` }}
            >
              {classifyWords( transliteration, !vishraamCharacters ).map(
                ( { word, type }, i ) => <span key={`${word}-${type}-${i}`} className={classNames( type, 'word' )}>{word}</span>,
              )}
            </p>
          </CSSTransition>
        ) )}

      </TransitionGroup>
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
  spacing: string,
  centerText: bool,
  justifyText: bool,
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
  presenterFontSize: number,
  relativeGurmukhiFontSize: number,
  relativeEnglishFontSize: number,
  relativePunjabiFontSize: number,
  relativeHindiFontSize: number,
  relativeUrduFontSize: number,
}

const {
  layout: {
    spacing,
    centerText,
    justifyText,
    larivaarAssist,
    larivaarGurbani,
    vishraamColors,
    vishraamTransliterationColors,
    vishraamCharacters,
    vishraamHeavy,
    vishraamMedium,
    vishraamLight,
    splitOnVishraam,
    presenterFontSize,
    relativeGurmukhiFontSize,
    relativeEnglishFontSize,
    relativePunjabiFontSize,
    relativeHindiFontSize,
    relativeUrduFontSize,
  },
  theme: {
    simpleGraphics,
  },
} = DEFAULT_OPTIONS.local

Line.defaultProps = {
  className: null,
  englishTranslation: null,
  spanishTranslation: null,
  punjabiTranslation: null,
  englishTransliteration: null,
  hindiTransliteration: null,
  urduTransliteration: null,
  spacing,
  centerText,
  justifyText,
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
  presenterFontSize,
  relativeGurmukhiFontSize,
  relativeEnglishFontSize,
  relativePunjabiFontSize,
  relativeHindiFontSize,
  relativeUrduFontSize,
}

export default Line
