/* eslint-disable react/no-array-index-key */
import React from 'react'
import { string, bool, number, objectOf, func } from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'
import { countSyllables, toSyllabicSymbols } from 'gurmukhi-utils'

import { partitionLine, classifyWords } from '../lib/utils'
import { DEFAULT_OPTIONS } from '../lib/options'
import { LANGUAGES, LANGUAGE_NAMES, TRANSLATION_ORDER, TRANSLITERATION_ORDER } from '../lib/consts'

import './Line.css'

const sortBy = sorter => ( [ n1 ], [ n2 ] ) => sorter[ n1 ] - sorter[ n2 ]

/**
 * Line Component.
 * Renders the various aspects of a single line.
 * @param {string} className An optional class name to append.
 * @param {string} gurmukhi The Gurmukhi of the line to render.
 * @param {string} translations The Punjabi translation of the line to render.
 * @param {string} transliterators The Punjabi translation of the line to render.
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
  translations,
  transliterators,
  syllabicWeights,
  syllableCount,
  inlineTransliteration,
  inlineColumnGuides,
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
  vishraamCharacters,
  vishraamLight,
  vishraamMedium,
  vishraamHeavy,
  splitOnVishraam: partition,
  simpleGraphics: simple,
} ) => {
  const fontSizes = {
    [ LANGUAGES.english ]: relativeEnglishFontSize,
    [ LANGUAGES.spanish ]: relativeEnglishFontSize,
    [ LANGUAGES.punjabi ]: relativePunjabiFontSize,
    [ LANGUAGES.hindi ]: relativeHindiFontSize,
    [ LANGUAGES.urdu ]: relativeUrduFontSize,
  }

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
      style={{ justifyContent: spacing, fontSize: `${presenterFontSize}vh` }}
    >
      <TransitionGroup appear exit={false} component={null}>
        <CSSTransition key={gurmukhi} classNames="fade" timeout={0}>
          <p className="source">
            {partitionLine( gurmukhi, !vishraamCharacters ).map( ( line, lineIndex ) => (
              <span key={lineIndex} className={classNames( 'partition', partition ? 'block' : 'inline' )}>
                {line.map( ( { word, type }, i ) => (
                  <span
                    key={`${word}-${type}-${i}`}
                    className={classNames( type, 'word', { 'with-guides': inlineColumnGuides, 'with-rows': inlineTransliteration || syllabicWeights || inlineColumnGuides } )}
                    style={{ fontSize: `${relativeGurmukhiFontSize}em` }}
                  >
                    <span className="gurmukhi">
                      {word}
                    </span>

                    {syllabicWeights && ( <span className="syllabic-weights">{toSyllabicSymbols( word )}</span> )}

                    {inlineTransliteration && Object
                      .entries( transliterators )
                      .sort( sortBy( TRANSLITERATION_ORDER ) )
                      .map( ( [ languageId, transliterate ] ) => (
                        <span
                          key={`${word}-${type}-${i}-${languageId}-transliteration`}
                          className={classNames( LANGUAGE_NAMES[ languageId ] )}
                          style={{ fontSize: `${fontSizes[ languageId ]}em` }}
                        >
                          {transliterate( word )}
                        </span>
                      ) )}
                  </span>
                ) )}
              </span>
            ) )}
            {syllableCount && ( <span className="syllable-count">{countSyllables( gurmukhi )}</span> )}
          </p>
        </CSSTransition>

        {Object
          .entries( translations )
          .sort( sortBy( TRANSLATION_ORDER ) )
          .map( ( [ languageId, translation ] ) => (
            <CSSTransition key={`${gurmukhi}-${languageId}-translation`} classNames="fade" timeout={0}>
              <p className={classNames( LANGUAGE_NAMES[ languageId ], 'translation' )} style={{ fontSize: `${fontSizes[ languageId ]}em` }}>
                {translation}
              </p>
            </CSSTransition>
          ) )}

        {!inlineTransliteration && Object
          .entries( transliterators )
          .sort( sortBy( TRANSLITERATION_ORDER ) )
          .map( ( [ languageId, transliterate ] ) => (
            <CSSTransition key={`${gurmukhi}-${languageId}-transliteration`} classNames="fade" timeout={0}>
              <p
                className={classNames( LANGUAGE_NAMES[ languageId ], 'transliteration' )}
                style={{ fontSize: `${fontSizes[ languageId ]}em` }}
              >
                {classifyWords( transliterate( gurmukhi ), !vishraamCharacters ).map(
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
  translations: objectOf( string ),
  transliterators: objectOf( func ),
  syllabicWeights: bool,
  syllableCount: bool,
  inlineTransliteration: bool,
  inlineColumnGuides: bool,
  spacing: string,
  centerText: bool,
  justifyText: bool,
  larivaarGurbani: bool,
  larivaarAssist: bool,
  vishraamColors: bool,
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
    syllabicWeights,
    syllableCount,
    inlineTransliteration,
    inlineColumnGuides,
    larivaarAssist,
    larivaarGurbani,
    vishraamColors,
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
  syllabicWeights,
  syllableCount,
  inlineTransliteration,
  inlineColumnGuides,
  spacing,
  centerText,
  justifyText,
  larivaarGurbani,
  larivaarAssist,
  vishraamColors,
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
  translations: {},
  transliterators: {},
}

export default Line
