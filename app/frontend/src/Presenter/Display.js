import React from 'react'
import { shape, bool, arrayOf, string } from 'prop-types'
import classNames from 'classnames'

import Line from './Line'

import './Display.css'

/**
 * Display Component.
 * Displays the current Shabad, with visual settings.
 * @param shabad The Shabad to render.
 * @param lineId The current line in the Shabad.
 */
const Display = ( { shabad, bani, lineId, settings } ) => {
  const {
    layout,
    vishraams,
    sources,
    theme: {
      simpleGraphics: simple,
      backgroundImage: background,
    },
  } = settings

  // Get the lines from the shabad, if they exist
  const { lines = [] } = shabad || bani || {}

  // Find the correct line in the Shabad
  const line = lines.find( ( { id } ) => lineId === id )

  // Gets the right translation
  const getTranslation = languageId => {
    const { sourceId } = shabad || line.shabad

    if ( !( sources && sources[ sourceId ] ) ) return null

    const { id: translationId } = sources[ sourceId ].translationSources[ languageId ]

    return line.translations.find( (
      ( { translationSourceId: id } ) => translationId === id
    ) ).translation
  }

  return (
    <div className={classNames( { simple, background }, 'display' )}>
      <div className="background-image" />
      {line && <Line
        {...layout}
        {...vishraams}
        gurmukhi={line.gurmukhi}
        englishTranslation={layout.englishTranslation && getTranslation( 1 )}
        punjabiTranslation={layout.punjabiTranslation && getTranslation( 2 )}
        transliteration={
          layout.englishTransliteration && line.transliterations[ 0 ].transliteration
        }
        simpleGraphics={simple}
      />}
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
    } ),
  } ).isRequired,
}

Display.defaultProps = {
  shabad: null,
  bani: null,
  lineId: null,
}

export default Display
