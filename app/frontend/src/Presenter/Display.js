import React from 'react'
import { hot } from 'react-hot-loader/root'
import { shape, bool, arrayOf, string } from 'prop-types'
import classNames from 'classnames'

import { getTranslation } from '../lib/utils'

import Line from './Line'

import './Display.css'

/**
 * Display Component.
 * Displays the current Shabad, with visual settings.
 * @param shabad The Shabad to render.
 * @param lineId The current line in the Shabad.
 */
const Display = ( { shabad, bani, lineId, recommendedSources, settings } ) => {
  const {
    layout,
    vishraams,
    sources,
    theme: {
      simpleGraphics: simple,
      backgroundImage: background,
      highlightCurrentLine: highlight,
      dimNextAndPrevLines: dim,
    },
  } = settings

  // Get the lines from the shabad, if they exist
  const { lines = [] } = shabad || bani || {}

  // Find the correct line in the Shabad
  const lineIndex = lines.findIndex( ( { id } ) => lineId === id )
  const line = lineIndex > -1 ? lines[ lineIndex ] : null

  // Get the next lines
  const { nextLines: nextLineCount, previousLines: previousLineCount } = layout
  const previousLines = previousLineCount && lineIndex
    ? lines.slice( Math.max( lineIndex - previousLineCount, 0 ), lineIndex )
    : []
  const nextLines = line ? lines.slice( lineIndex + 1, lineIndex + nextLineCount + 1 ) : []

  const getTranslationFor = languageId => getTranslation( {
    shabad,
    recommendedSources,
    sources,
    line,
    languageId,
  } )

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
            {...vishraams}
            gurmukhi={gurmukhi}
          />
        ) )}
      </div>
      {line && (
      <Line
        className={classNames( { highlight }, 'current-line' )}
        {...layout}
        {...vishraams}
        gurmukhi={line.gurmukhi}
        englishTranslation={layout.englishTranslation && getTranslationFor( 1 )}
        punjabiTranslation={layout.punjabiTranslation && getTranslationFor( 2 )}
        transliteration={
          layout.englishTransliteration && line.transliterations[ 0 ].transliteration
        }
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
            {...vishraams}
            gurmukhi={gurmukhi}
          />
        ) )}
      </div>
    </div>
  )
}

Display.propTypes = {
  lineId: string,
  shabad: shape( {
    lines: arrayOf( shape( Line.PropTypes ) ),
  } ),
  bani: shape( {
    lines: arrayOf( shape( Line.PropTypes ) ),
  } ),
  settings: shape( {
    theme: shape( {
      simpleGraphics: bool,
      backgroundImage: bool,
      highlightCurrentLine: bool,
      dimNextAndPrevLines: bool,
    } ),
  } ).isRequired,
  recommendedSources: shape( { nameEnglish: string } ).isRequired,
}

Display.defaultProps = {
  shabad: null,
  bani: null,
  lineId: null,
}

export default hot( Display )
