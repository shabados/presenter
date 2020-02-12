import React, { useContext } from 'react'
import { node } from 'prop-types'
import { GlobalHotKeys } from 'react-hotkeys'

import { SettingsContext, ContentContext, WritersContext, RecommendedSourcesContext } from '../lib/contexts'
import { mapPlatformKeys } from '../lib/utils'
import { COPY_SHORTCUTS } from '../lib/keyMap'
import { useCopyToClipboard, useCurrentLine, useTranslations, useTransliterations } from '../lib/hooks'
import { LANGUAGES } from '../lib/consts'

const CopyHotkeys = ( { children } ) => {
  const { local: { hotkeys } } = useContext( SettingsContext )
  const [ line ] = useCurrentLine()

  // Get Shabad, writer, sources for getting the author
  const { shabad } = useContext( ContentContext )
  const writers = useContext( WritersContext )
  const recommendedSources = useContext( RecommendedSourcesContext )

  // Get all translations
  const translations = useTranslations( line && [
    LANGUAGES.english,
    LANGUAGES.punjabi,
    LANGUAGES.spanish,
  ] )

  // Get all transliterations
  const transliterations = useTransliterations( line && [
    LANGUAGES.english,
    LANGUAGES.hindi,
    LANGUAGES.urdu,
  ] )

  const getAuthor = () => {
    if ( !line ) return ''

    const { sourceId, writerId } = shabad || line.shabad
    const { sourcePage } = line

    const { nameEnglish: sourceName, pageNameEnglish: pageName } = recommendedSources[ sourceId ]
    const { nameEnglish: writerName } = writers[ writerId ]

    return `${writerName} - ${sourceName} - ${pageName} ${sourcePage}`
  }

  const copyToClipboard = useCopyToClipboard()

  // Generate hotkeys for copying to clipboard
  const hotkeyHandlers = !!line && [
    [ COPY_SHORTCUTS.copyGurmukhi.name, line.gurmukhi ],
    [ COPY_SHORTCUTS.copyEnglishTranslation.name, translations.english ],
    [ COPY_SHORTCUTS.copyPunjabiTranslation.name, translations.punjabi ],
    [ COPY_SHORTCUTS.copySpanishTranslation.name, translations.spanish ],
    [ COPY_SHORTCUTS.copyEnglishTransliteration.name, transliterations.english ],
    [ COPY_SHORTCUTS.copyHindiTransliteration.name, transliterations.hindi ],
    [ COPY_SHORTCUTS.copyUrduTransliteration.name, transliterations.urdu ],
    [ COPY_SHORTCUTS.copyAuthor.name, getAuthor() ],
  ].reduce( ( hotkeys, [ name, content ] ) => ( {
    ...hotkeys,
    [ name ]: () => copyToClipboard( content ),
  } ), {} )
  return (
    <GlobalHotKeys keyMap={mapPlatformKeys( hotkeys )} handlers={hotkeyHandlers}>
      {children}
    </GlobalHotKeys>
  )
}

CopyHotkeys.propTypes = {
  children: node,
}

CopyHotkeys.defaultProps = {
  children: null,
}

export default CopyHotkeys
