import React, { useContext } from 'react'
import classNames from 'classnames'

import Line from './Line'
import ThemeLoader from './ThemeLoader'

import { SettingsContext, StatusContext } from '../lib/contexts'
import { LANGUAGES } from '../lib/consts'
import { useTranslations, useTransliterations, useLine, useCurrentLineIn } from '../lib/hooks'

import './index.css'

const Overlay = () => {
  const settings = useContext( SettingsContext )
  const { connected } = useContext( StatusContext )

  const { global: globalSettings } = settings || {}
  const { overlay: {
    overlayName,
    larivaarGurbani,
    larivaarAssist,
    ...overlay
  } } = globalSettings || {}

  const [ line ] = useCurrentLineIn( useLine )

  const translations = useCurrentLineIn( useTranslations( line && [
    overlay.englishTranslation && LANGUAGES.english,
    overlay.punjabiTranslation && LANGUAGES.punjabi,
    overlay.spanishTranslation && LANGUAGES.spanish,
  ] ) )

  const transliterations = useCurrentLineIn( useTransliterations( line && [
    overlay.englishTransliteration && LANGUAGES.english,
    overlay.hindiTransliteration && LANGUAGES.hindi,
    overlay.urduTransliteration && LANGUAGES.urdu,
  ] ) )

  return connected && (
    <div className={classNames( {
      empty: !line,
    }, 'overlay' )}
    >
      <ThemeLoader name={overlayName} />
      <Line
        simpleGraphics
        gurmukhi={line ? line.gurmukhi : ''}
        {...( line && {
          larivaarGurbani,
          larivaarAssist,
          englishTranslation: translations.english,
          punjabiTranslation: translations.punjabi,
          spanishTranslation: translations.spanish,
          englishTransliteration: transliterations.english,
          hindiTransliteration: transliterations.hindi,
          urduTransliteration: transliterations.urdu,
        } )}
      />
    </div>
  )
}

export default Overlay
