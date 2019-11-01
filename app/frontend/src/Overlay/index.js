import React from 'react'
import { shape, arrayOf, string, bool } from 'prop-types'

import Line from './Line'
import ThemeLoader from './ThemeLoader'

import { getTranslation } from '../lib/utils'

import './index.css'

const Overlay = ( { shabad, bani, lineId, settings, connected } ) => {
  const { local: localSettings } = settings || {}
  const { sources } = localSettings || {}

  // Get the lines from the shabad, if they exist
  const { lines = [] } = shabad || bani || {}

  // Find the correct line in the Shabad
  const lineIndex = lines.findIndex( ( { id } ) => lineId === id )
  const line = lineIndex > -1 ? lines[ lineIndex ] : null

  const getTranslationFor = languageId => getTranslation( { shabad, sources, line, languageId } )

  return (
    <div className="overlay">
      <ThemeLoader connected={connected} />
      <Line
        simpleGraphics
        gurmukhi={line ? line.gurmukhi : ''}
        {...( line && {
          englishTranslation: getTranslationFor( 1 ),
          punjabiTranslation: getTranslationFor( 2 ),
          transliteration: line.transliterations[ 0 ].transliteration,
        } )}
      />
    </div>
  )
}

Overlay.propTypes = {
  lineId: string,
  shabad: shape( {
    lines: arrayOf( shape( Line.PropTypes ) ),
  } ),
  bani: shape( {
    lines: arrayOf( shape( Line.PropTypes ) ),
  } ),
  settings: shape( {} ).isRequired,
  connected: bool.isRequired,
}

Overlay.defaultProps = {
  shabad: null,
  bani: null,
  lineId: null,
}

export default Overlay
