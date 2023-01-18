import './index.css'

import classNames from 'classnames'
import { mapValues } from 'lodash'
import { useContext } from 'react'

import { SettingsContext, StatusContext } from '../lib/contexts'
import { LANGUAGES } from '../lib/data'
import { useCurrentLine, useTranslations } from '../lib/hooks'
import { customiseLine, getTransliterators } from '../lib/line'
import { filterFalsyValues } from '../lib/utils'
import Line from './Line'
import ThemeLoader from './ThemeLoader'

const Overlay = () => {
  const settings = useContext( SettingsContext )
  const { connected } = useContext( StatusContext )

  const { global: globalSettings } = settings || {}
  const { overlay: { overlayName, ...overlay } } = globalSettings || {}

  const [ line ] = useCurrentLine()
  const typeId = line?.typeId as number || -1
  const { lineEnding } = overlay

  const translations = mapValues(
    useTranslations( filterFalsyValues( [
      overlay.englishTranslation && LANGUAGES.english,
      overlay.punjabiTranslation && LANGUAGES.punjabi,
      overlay.spanishTranslation && LANGUAGES.spanish,
    ] ) as number[] ),
    ( line ) => customiseLine( line, { lineEnding, typeId } )
  )

  const transliterators = mapValues(
    getTransliterators( filterFalsyValues( [
      overlay.englishTransliteration && LANGUAGES.english,
      overlay.hindiTransliteration && LANGUAGES.hindi,
      overlay.urduTransliteration && LANGUAGES.urdu,
    ] ) as number[] ),
    ( transliterate ) => ( text: string ) => transliterate(
      customiseLine( text, { lineEnding, typeId } )
    ),
  )

  if ( !connected ) return null

  return (
    <div className={classNames( { empty: !line }, 'overlay' )}>
      <ThemeLoader name={overlayName} />

      <Line
        {...overlay}
        gurmukhi={line ? line.gurmukhi as string : ''}
        translations={translations}
        transliterators={transliterators}
      />
    </div>
  )
}

export default Overlay
