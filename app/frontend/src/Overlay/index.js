import React, { useContext } from 'react'
import classNames from 'classnames'

import Line from './Line'
import ThemeLoader from './ThemeLoader'

import { getTranslation, getTransliteration, findLineIndex } from '../lib/utils'
import { ContentContext, SettingsContext, StatusContext, RecommendedSourcesContext } from '../lib/contexts'
import { LANGUAGES } from '../lib/consts'

import './index.css'

const Overlay = () => {
  const { shabad, bani, lineId } = useContext( ContentContext )
  const settings = useContext( SettingsContext )
  const { connected } = useContext( StatusContext )
  const recommendedSources = useContext( RecommendedSourcesContext )

  const { local: localSettings, global: globalSettings } = settings || {}
  const { sources } = localSettings || {}
  const { overlay: {
    overlayName,
    larivaarGurbani,
    larivaarAssist,
    ...overlay
  } } = globalSettings || {}

  // Get the lines from the shabad, if they exist
  const { lines = [] } = shabad || bani || {}

  // Find the correct line in the Shabad
  const lineIndex = findLineIndex( lines, lineId )
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
    <div className={classNames( {
      empty: !line,
    }, 'overlay' )}
    >
      <ThemeLoader connected={connected} name={overlayName} />
      <Line
        simpleGraphics
        gurmukhi={line ? line.gurmukhi : ''}
        {...( line && {
          larivaarGurbani,
          larivaarAssist,
          englishTranslation: overlay.englishTranslation && getTranslationFor( LANGUAGES.english ),
          punjabiTranslation: overlay.punjabiTranslation && getTranslationFor( LANGUAGES.punjabi ),
          spanishTranslation: overlay.spanishTranslation && getTranslationFor( LANGUAGES.spanish ),
          englishTransliteration: (
            overlay.englishTransliteration && getTransliterationFor( LANGUAGES.english )
          ),
          hindiTransliteration: (
            overlay.hindiTransliteration && getTransliterationFor( LANGUAGES.hindi )
          ),
          urduTransliteration: (
            overlay.urduTransliteration && getTransliterationFor( LANGUAGES.urdu )
          ),
        } )}
      />
    </div>
  )
}

export default Overlay
