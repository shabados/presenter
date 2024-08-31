import './index.css'

import classNames from 'classnames'
import { mapValues } from 'lodash'

import { LANGUAGES } from '~/helpers/data'
import { customiseLine, getTransliterators } from '~/helpers/line'
import { ClientSettings } from '~/helpers/options'
import { filterFalsyValues } from '~/helpers/utils'
import { useCurrentLine, useCurrentLines, useTranslations } from '~/hooks'

import Line from '../Line'

type DisplayProps = {
  settings: Pick<ClientSettings, 'layout' | 'display' | 'vishraams' | 'theme'>,
}

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
  const [ line, lineIndex ] = useCurrentLine()
  const typeId = ( line?.typeId ) || -1

  // Get the next lines
  const { nextLines: nextLineCount, previousLines: previousLineCount } = display
  const previousLines = previousLineCount && lineIndex
    ? lines.slice( Math.max( lineIndex - previousLineCount, 0 ), lineIndex )
    : []
  const nextLines = line ? lines.slice( lineIndex + 1, lineIndex + nextLineCount + 1 ) : []

  const translations = mapValues(
    useTranslations( filterFalsyValues( [
      display.englishTranslation && LANGUAGES.english,
      display.punjabiTranslation && LANGUAGES.punjabi,
      display.spanishTranslation && LANGUAGES.spanish,
    ] ) as number[] ),
    ( line ) => customiseLine( line, { lineEnding, typeId } ),
  )

  const transliterators = mapValues(
    getTransliterators( filterFalsyValues( [
      display.englishTransliteration && LANGUAGES.english,
      display.hindiTransliteration && LANGUAGES.hindi,
      display.urduTransliteration && LANGUAGES.urdu,
    ] ) as number[] ),
    ( transliterate ) => ( text: string ) => transliterate(
      customiseLine( text, { lineEnding, typeId } )
    ),
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
