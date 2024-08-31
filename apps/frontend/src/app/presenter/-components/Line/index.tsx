/* eslint-disable react/no-array-index-key */
import './index.css'

import classNames from 'classnames'
import { countSyllables, toSyllabicSymbols } from 'gurmukhi-utils'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import {
  LANGUAGE_NAMES,
  LANGUAGES,
  TRANSLATION_ORDER,
  Translations,
  TRANSLITERATION_ORDER,
  Transliterators,
} from '~/helpers/data'
import { classifyWords, partitionLine, sortBy } from '~/helpers/line'
import { DEFAULT_OPTIONS } from '~/helpers/options'
import { filterFalsyObjectValues } from '~/helpers/utils'

type LineProps = {
  className?: string,
  gurmukhi: string,
  translations?: Translations,
  transliterators?: Transliterators,
  syllabicWeights?: boolean,
  syllableCount?: boolean,
  inlineTransliteration?: boolean,
  inlineColumnGuides?: boolean,
  spacing?: string,
  centerText?: boolean,
  justifyText?: boolean,
  larivaarGurbani?: boolean,
  larivaarAssist?: boolean,
  vishraamColors?: boolean,
  vishraamCharacters?: boolean,
  vishraamLight?: boolean,
  vishraamMedium?: boolean,
  vishraamHeavy?: boolean,
  splitOnVishraam?: boolean,
  simpleGraphics?: boolean,
  presenterFontSize?: number,
  relativeGurmukhiFontSize?: number,
  relativeEnglishFontSize?: number,
  relativePunjabiFontSize?: number,
  relativeHindiFontSize?: number,
  relativeUrduFontSize?: number,
}

const {
  display: {
    syllabicWeights: defaultSyllabicWeights,
    syllableCount: defaultSyllableCount,
    larivaarAssist: defaultLarivaarAssist,
    larivaarGurbani: defaultLarivaarGurbani,
  },
  layout: {
    spacing: defaultSpacing,
    centerText: defaultCenterText,
    justifyText: defaultJustifyText,
    inlineTransliteration: defaultInlineTransliteration,
    inlineColumnGuides: defaultInlineColumnGuides,
    splitOnVishraam: defaultSplitOnVishraam,
    presenterFontSize: defaultPresenterFontSize,
    relativeGurmukhiFontSize: defaultRelativeGurmukhiFontSize,
    relativeEnglishFontSize: defaultRelativeEnglishFontSize,
    relativePunjabiFontSize: defaultRelativePunjabiFontSize,
    relativeHindiFontSize: defaultRelativeHindiFontSize,
    relativeUrduFontSize: defaultRelativeUrduFontSize,
  },
  vishraams: {
    vishraamColors: defaultVishraamColors,
    vishraamCharacters: defaultVishraamCharacters,
    vishraamHeavy: defaultVishraamHeavy,
    vishraamMedium: defaultVishraamMedium,
    vishraamLight: defaultVishraamLight,
  },
  theme: { simpleGraphics },
} = DEFAULT_OPTIONS.local

const Line = ( {
  className = undefined,
  gurmukhi,
  translations = {},
  transliterators = {},
  syllabicWeights = defaultSyllabicWeights,
  syllableCount = defaultSyllableCount,
  inlineTransliteration = defaultInlineTransliteration,
  inlineColumnGuides = defaultInlineColumnGuides,
  spacing = defaultSpacing,
  centerText = defaultCenterText,
  justifyText = defaultJustifyText,
  presenterFontSize = defaultPresenterFontSize,
  relativeGurmukhiFontSize = defaultRelativeGurmukhiFontSize,
  relativeEnglishFontSize = defaultRelativeEnglishFontSize,
  relativePunjabiFontSize = defaultRelativePunjabiFontSize,
  relativeHindiFontSize = defaultRelativeHindiFontSize,
  relativeUrduFontSize = defaultRelativeUrduFontSize,
  larivaarGurbani: larivaar = defaultLarivaarGurbani,
  larivaarAssist = defaultLarivaarAssist,
  vishraamColors: vishraams = defaultVishraamColors,
  vishraamCharacters = defaultVishraamCharacters,
  vishraamLight = defaultVishraamLight,
  vishraamMedium = defaultVishraamMedium,
  vishraamHeavy = defaultVishraamHeavy,
  splitOnVishraam: partition = defaultSplitOnVishraam,
  simpleGraphics: simple,
}: LineProps ) => {
  const fontSizes = filterFalsyObjectValues( {
    [ LANGUAGES.english ]: relativeEnglishFontSize,
    [ LANGUAGES.spanish ]: relativeEnglishFontSize,
    [ LANGUAGES.punjabi ]: relativePunjabiFontSize,
    [ LANGUAGES.hindi ]: relativeHindiFontSize,
    [ LANGUAGES.urdu ]: relativeUrduFontSize,
  } )

  return (
    <div
      className={classNames(
        className,
        {
          assist: larivaar && larivaarAssist,
          light: vishraams && vishraamLight,
          medium: vishraams && vishraamMedium,
          heavy: vishraams && vishraamHeavy,
          vishraams,
          larivaar,
          simple,
          'center-text': centerText,
          'justify-text': justifyText,
        },
        'line'
      )}
      style={{ justifyContent: spacing, fontSize: `${presenterFontSize}vh` }}
    >
      <TransitionGroup appear exit={false} component={null}>
        <CSSTransition key={gurmukhi} classNames="fade" timeout={0}>
          <p className="source">
            {partitionLine( gurmukhi, !vishraamCharacters ).map(
              ( line, lineIndex ) => (
                <span
                  key={lineIndex}
                  className={classNames(
                    'partition',
                    partition ? 'block' : 'inline'
                  )}
                >
                  {line.map( ( { word, type }, i ) => (
                    // TODO: If classifyWord's type type can be changed
                    // to string instead of string | null,
                    // then we won't have to || the type value here in the template string
                    <span
                      key={`${word}-${type || ''}-${i}`}
                      className={classNames( type, 'word', {
                        'with-guides': inlineColumnGuides,
                        'with-rows':
                          inlineTransliteration
                          || syllabicWeights
                          || inlineColumnGuides,
                      } )}
                      style={relativeGurmukhiFontSize ? { fontSize: `${relativeGurmukhiFontSize}em` } : {}}
                    >
                      <span className="gurmukhi">{word}</span>

                      {syllabicWeights && (
                        <span className="syllabic-weights">
                          {toSyllabicSymbols( word )}
                        </span>
                      )}

                      {inlineTransliteration
                        && Object.entries( transliterators )
                          .sort( sortBy( TRANSLITERATION_ORDER ) )
                          .map( ( [ languageId, transliterate ] ) => (
                            <span
                              key={`${word}-${type || ''}-${i}-${languageId}-transliteration`}
                              className={classNames( LANGUAGE_NAMES[ languageId ] )}
                              style={fontSizes[ Number( languageId ) ] ? { fontSize: `${fontSizes[ Number( languageId ) ]}em` } : {}}
                            >
                              {transliterate( word )}
                            </span>
                          ) )}
                    </span>
                  ) )}
                </span>
              )
            )}

            {syllableCount && (
              <span className="syllable-count">{countSyllables( gurmukhi )}</span>
            )}
          </p>
        </CSSTransition>

        {Object.entries( translations )
          .sort( sortBy( TRANSLATION_ORDER ) )
          .map( ( [ languageId, translation ] ) => (
            <CSSTransition
              key={`${gurmukhi}-${languageId}-translation`}
              classNames="fade"
              timeout={0}
            >
              <p
                className={classNames(
                  LANGUAGE_NAMES[ languageId ],
                  'translation'
                )}
                style={{ fontSize: `${fontSizes[ Number( languageId ) ]}em` }}
              >
                {translation}
              </p>
            </CSSTransition>
          ) )}

        {!inlineTransliteration
          && Object.entries( transliterators )
            .sort( sortBy( TRANSLITERATION_ORDER ) )
            .map( ( [ languageId, transliterate ] ) => (
              <CSSTransition
                key={`${gurmukhi}-${languageId}-transliteration`}
                classNames="fade"
                timeout={0}
              >
                <p
                  className={classNames(
                    LANGUAGE_NAMES[ languageId ],
                    'transliteration'
                  )}
                  style={{ fontSize: `${fontSizes[ Number( languageId ) ]}em` }}
                >
                  {classifyWords(
                    transliterate( gurmukhi ),
                    !vishraamCharacters
                  ).map( ( { word, type }, i ) => (
                    <span
                      key={`${word}-${type || ''}-${i}`}
                      className={classNames( type, 'word' )}
                    >
                      {word}
                    </span>
                  ) )}
                </p>
              </CSSTransition>
            ) )}
      </TransitionGroup>
    </div>
  )
}

export default Line
