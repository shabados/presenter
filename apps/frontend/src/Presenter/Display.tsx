import './Display.css'

import { Display as DisplayType, Layout, Vishraams } from '@presenter/contract/src'
import classNames from 'classnames'
import { mapValues } from 'lodash'

import { LANGUAGES } from '../lib/data'
import { useCurrentLine, useCurrentLines, useTranslations } from '../lib/hooks'
import { customiseLine, getTransliterators } from '../lib/line'
import Line from './Line'

type DisplayProps = {
  settings: {
    layout: Layout,
    display: DisplayType,
    vishraams: Vishraams,
    theme: {
      simpleGraphics: boolean,
      backgroundImage: boolean,
      highlightCurrentLine: boolean,
      dimNextAndPrevLines: boolean,
    },
  },
}

/**
 * Display Component.
 * Displays the current Shabad, with visual settings.
 * @param shabad The Shabad to render.
 * @param lineId The current line in the Shabad.
 */
const Display = ( { settings }: DisplayProps ) => {
  const {
    layout,
    display,
    vishraams,
    theme: {
      simpleGraphics: simple,
      backgroundImage: background,
      highlightCurrentLine: highlight,
      dimNextAndPrevLines: dim,
    },
  } = settings

  const { lineEnding } = display

  // Find the correct line in the Shabad
  const lines = useCurrentLines()
  const [ line = [], lineIndex ] = useCurrentLine()
  const { typeId } = line || {}

  // Get the next lines
  const { nextLines: nextLineCount, previousLines: previousLineCount } = display
  const previousLines = previousLineCount && lineIndex
    ? lines.slice( Math.max( lineIndex - previousLineCount, 0 ), lineIndex )
    : []
  const nextLines = line ? lines.slice( lineIndex + 1, lineIndex + nextLineCount + 1 ) : []

  const translations = mapValues(
    useTranslations( [
      display.englishTranslation && LANGUAGES.english,
      display.punjabiTranslation && LANGUAGES.punjabi,
      display.spanishTranslation && LANGUAGES.spanish,
    ] ),
    ( line ) => customiseLine( line, { lineEnding, typeId } ),
  )

  const transliterators = mapValues(
    getTransliterators( [
      display.englishTransliteration && LANGUAGES.english,
      display.hindiTransliteration && LANGUAGES.hindi,
      display.urduTransliteration && LANGUAGES.urdu,
    ] ),
    ( transliterate ) => ( text ) => transliterate( customiseLine( text, { lineEnding, typeId } ) ),
  )

  return (
    <div className={classNames( { simple, background }, 'display' )}>
      <div className="background-image" />

      <div className={classNames( { dim }, 'previous-lines' )}>
        {line && previousLines.map( ( { id, gurmukhi } ) => (
          <Line
            key={id}
            className="previous-line"
            simpleGraphics={simple}
            {...layout}
            {...display}
            {...vishraams}
            gurmukhi={gurmukhi}
          />
        ) )}
      </div>

      {line && (
        <Line
          className={classNames( { highlight }, 'current-line' )}
          {...layout}
          {...display}
          {...vishraams}
          gurmukhi={line.gurmukhi}
          translations={translations}
          transliterators={transliterators}
          simpleGraphics={simple}
        />
      )}

      <div className={classNames( { dim }, 'next-lines' )}>
        {line && nextLines.map( ( { id, gurmukhi } ) => (
          <Line
            key={id}
            className="next-line"
            simpleGraphics={simple}
            {...layout}
            {...display}
            {...vishraams}
            gurmukhi={gurmukhi}
          />
        ) )}
      </div>

    </div>
  )
}

export default Display