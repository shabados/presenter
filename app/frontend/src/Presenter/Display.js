import React, { useContext } from 'react'
import { hot } from 'react-hot-loader/root'
import { shape, bool } from 'prop-types'
import classNames from 'classnames'
import { GlobalHotKeys } from 'react-hotkeys'
import copy from 'copy-to-clipboard'
import { useSnackbar } from 'notistack'

import { mapPlatformKeys } from '../lib/utils'
import { ContentContext, RecommendedSourcesContext, WritersContext } from '../lib/contexts'
import { COPY_SHORTCUTS } from '../lib/keyMap'
import { LANGUAGES } from '../lib/consts'
import { useTranslations, useTransliterations, useCurrentLine, useCurrentLines } from '../lib/hooks'

import Line from './Line'

import './Display.css'

const truncate = input => ( input.length > 30 ? `${input.substring( 0, 30 )}...` : input )

/**
 * Display Component.
 * Displays the current Shabad, with visual settings.
 * @param shabad The Shabad to render.
 * @param lineId The current line in the Shabad.
 */
const Display = ( { settings } ) => {
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
    hotkeys,
  } = settings


  // Find the correct line in the Shabad
  const lines = useCurrentLines()
  const [ line, lineIndex ] = useCurrentLine()

  const writers = useContext( WritersContext )

  // Get the next lines
  const { nextLines: nextLineCount, previousLines: previousLineCount } = display
  const previousLines = previousLineCount && lineIndex
    ? lines.slice( Math.max( lineIndex - previousLineCount, 0 ), lineIndex )
    : []
  const nextLines = line ? lines.slice( lineIndex + 1, lineIndex + nextLineCount + 1 ) : []


  // Copy lines to clipboard
  const { enqueueSnackbar } = useSnackbar()
  const copyToClipboard = text => () => {
    if ( !text ) return

    copy( text )
    enqueueSnackbar( `Copied "${truncate( text )}" to clipboard`, { autoHideDuration: 1000, preventDuplicate: true } )
  }

  // Get Shabad and sources for getting the author
  const { shabad } = useContext( ContentContext )
  const recommendedSources = useContext( RecommendedSourcesContext )

  const getAuthor = () => {
    if ( !line ) return ''

    const { sourceId, writerId } = shabad || line.shabad
    const { sourcePage } = line

    const { nameEnglish: sourceName, pageNameEnglish: pageName } = recommendedSources[ sourceId ]
    const { nameEnglish: writerName } = writers[ writerId ]

    return `${writerName} - ${sourceName} - ${pageName} ${sourcePage}`
  }

  const translations = useTranslations( line && [
    display.englishTranslation && LANGUAGES.english,
    display.punjabiTranslation && LANGUAGES.punjabi,
    display.spanishTranslation && LANGUAGES.spanish,
  ] )

  const transliterations = useTransliterations( line && [
    display.englishTransliteration && LANGUAGES.english,
    display.hindiTransliteration && LANGUAGES.hindi,
    display.urduTransliteration && LANGUAGES.urdu,
  ] )

  // Generate hotkeys for copying to clipboard
  const hotkeyHandlers = !!line && [
    [ COPY_SHORTCUTS.copyGurmukhi.name, line.gurmukhi ],
    [ COPY_SHORTCUTS.copyEnglishTranslation.name, translations.english ],
    [ COPY_SHORTCUTS.copyPunjabiTranslation.name, translations.punjabi ],
    [ COPY_SHORTCUTS.copySpanishTranslation.name, translations.spanish ],
    [ COPY_SHORTCUTS.copyEnglishTransliteration.name, transliterations.english ],
    [ COPY_SHORTCUTS.copyHindiTransliteration.name, transliterations.hindi ],
    [ COPY_SHORTCUTS.copyUrduTransliteration.name, transliterations.urdu ],
    [ COPY_SHORTCUTS.copyAuthor.name, getAuthor() ],
  ].reduce( ( hotkeys, [ name, content ] ) => ( {
    ...hotkeys,
    [ name ]: copyToClipboard( content ),
  } ), {} )

  return (
    <GlobalHotKeys keyMap={mapPlatformKeys( hotkeys )} handlers={hotkeyHandlers}>

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
            englishTranslation={translations.english}
            punjabiTranslation={translations.punjabi}
            spanishTranslation={translations.spanish}
            englishTransliteration={transliterations.english}
            hindiTransliteration={transliterations.hindi}
            urduTransliteration={transliterations.urdu}
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

    </GlobalHotKeys>
  )
}

Display.propTypes = {
  settings: shape( {
    theme: shape( {
      simpleGraphics: bool,
      backgroundImage: bool,
      highlightCurrentLine: bool,
      dimNextAndPrevLines: bool,
    } ),
  } ).isRequired,
}

export default hot( Display )
