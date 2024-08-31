import { createLazyFileRoute } from '@tanstack/react-router'
import classNames from 'classnames'
import { mapValues } from 'lodash'
import { useContext } from 'react'

import { SettingsContext, StatusContext } from '~/helpers/contexts'
import { LANGUAGES } from '~/helpers/data'
import { customiseLine, getTransliterators } from '~/helpers/line'
import { filterFalsyValues } from '~/helpers/utils'
import { useCurrentLine, useTranslations } from '~/hooks'

import Line from './-components/Line'
import ThemeLoader from './-components/ThemeLoader'

const Overlay = () => {
  const settings = useContext( SettingsContext )
  const { connected } = useContext( StatusContext )

  const { global: globalSettings } = settings || {}
  const { overlay: { overlayName, ...overlay } } = globalSettings || {}

  const [ line ] = useCurrentLine()
  const { typeId } = line
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
        gurmukhi={line ? line.gurmukhi : ''}
        translations={translations}
        transliterators={transliterators}
      />
    </div>
  )
}

export const Route = createLazyFileRoute( '/overlay/' )( {
  component: Overlay,
} )
