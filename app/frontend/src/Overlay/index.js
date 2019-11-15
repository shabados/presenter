import React from 'react'
import { shape, arrayOf, string, bool } from 'prop-types'

import Line from './Line'
import ThemeLoader from './ThemeLoader'

import { getTranslation, getTransliteration } from '../lib/utils'

import './index.css'

const Overlay = ( { shabad, bani, lineId, recommendedSources, settings, connected } ) => {
  const { local: localSettings } = settings || {}
  const { sources } = localSettings || {}

  // Get the lines from the shabad, if they exist
  const { lines = [] } = shabad || bani || {}

  // Find the correct line in the Shabad
  const lineIndex = lines.findIndex( ( { id } ) => lineId === id )
  const line = lineIndex > -1 ? lines[ lineIndex ] : null

  const getTranslationFor = languageId => getTranslation( {
    shabad,
    recommendedSources,
    sources,
    line,
    languageId,
  } )

  const getTransliterationFor = languageId => getTransliteration( line, languageId )

  return (
    <div className="overlay">
      <ThemeLoader connected={connected} />
      <Line
        simpleGraphics
        gurmukhi={line ? line.gurmukhi : ''}
        {...( line && {
          englishTranslation: getTranslationFor( 1 ),
          punjabiTranslation: getTranslationFor( 2 ),
          spanishTranslation: getTranslationFor( 3 ),
          englishTransliteration: getTransliterationFor( 1 ),
          hindiTransliteration: getTransliterationFor( 4 ),
          urduTransliteration: getTransliterationFor( 5 ),
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
  recommendedSources: shape( { nameEnglish: string } ).isRequired,
  connected: bool.isRequired,
}

Overlay.defaultProps = {
  shabad: null,
  bani: null,
  lineId: null,
}

export default Overlay
