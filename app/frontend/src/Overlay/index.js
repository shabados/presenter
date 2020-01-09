import React, { useContext } from 'react'

import Line from './Line'
import ThemeLoader from './ThemeLoader'

import { getTranslation, findLineIndex } from '../lib/utils'
import { ContentContext, SettingsContext, StatusContext, RecommendedSourcesContext } from '../lib/contexts'

import './index.css'

const Overlay = () => {
  const { shabad, bani, lineId } = useContext( ContentContext )
  const settings = useContext( SettingsContext )
  const { connected } = useContext( StatusContext )
  const recommendedSources = useContext( RecommendedSourcesContext )

  const { local: localSettings } = settings || {}
  const { sources } = localSettings || {}

  // Get the lines from the shabad, if they exist
  const { lines = [] } = shabad || bani || {}

  // Find the correct line in the Shabad
  const lineIndex = findLineIndex( lines, lineId )
  const line = lineIndex > -1 ? lines[ lineIndex ] : null

  const getTranslationFor = languageId => getTranslation( {
    shabad,
    sources,
    line,
    languageId,
    recommendedSources,
  } )

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

export default Overlay
