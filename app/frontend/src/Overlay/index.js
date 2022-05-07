import './index.css'

import classNames from 'classnames'
import { mapValues } from 'lodash'
import { useContext } from 'react'

import { SettingsContext, StatusContext } from '../lib/contexts'
import { LANGUAGES } from '../lib/data'
import { useCurrentLine, useTranslations } from '../lib/hooks'
import { customiseLine, getTransliterators } from '../lib/line'
import Line from './Line'
import ThemeLoader from './ThemeLoader'

const Overlay = () => {
  const settings = useContext( SettingsContext )
  const { connected } = useContext( StatusContext )

  const { global: globalSettings } = settings || {}
  const { overlay: { overlayName, ...overlay } } = globalSettings || {}

  const [ line ] = useCurrentLine()
  const { typeId } = line || {}
  const { lineEnding } = overlay

  const translations = mapValues(
    useTranslations( [
      overlay.englishTranslation && LANGUAGES.english,
      overlay.punjabiTranslation && LANGUAGES.punjabi,
      overlay.spanishTranslation && LANGUAGES.spanish,
    ] ),
    ( line ) => customiseLine( line, { lineEnding, typeId } ),
  )

  const transliterators = mapValues(
    getTransliterators( [
      overlay.englishTransliteration && LANGUAGES.english,
      overlay.hindiTransliteration && LANGUAGES.hindi,
      overlay.urduTransliteration && LANGUAGES.urdu,
    ] ),
    ( transliterate ) => ( text ) => transliterate( customiseLine( text, { lineEnding, typeId } ) ),
  )

  return connected && (
    <div className={classNames( { empty: !line }, 'overlay' )}>
      <ThemeLoader name={overlayName} />

      <Line
        {...overlay}
        simpleGraphics
        gurmukhi={line ? line.gurmukhi : ''}
        translations={translations}
        transliterators={transliterators}
      />
    </div>
  )
}

export default Overlay
