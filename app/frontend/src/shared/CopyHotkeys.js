import React, { useContext } from 'react'
import { node } from 'prop-types'
import { GlobalHotKeys } from 'react-hotkeys'
import { toUnicode } from 'gurmukhi-utils'

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
  const hotkeyHandlers = [
    [ COPY_SHORTCUTS.copyGurmukhiAscii.name, () => line.gurmukhi, 'gurmukhi' ],
    [ COPY_SHORTCUTS.copyGurmukhiUnicode.name, () => toUnicode( line.gurmukhi ), 'gurmukhi' ],
    [ COPY_SHORTCUTS.copyEnglishTranslation.name, () => translations.english, 'english translation' ],
    [ COPY_SHORTCUTS.copyPunjabiTranslation.name, () => translations.punjabi, 'punjabi translation' ],
    [ COPY_SHORTCUTS.copySpanishTranslation.name, () => translations.spanish, 'spanish translation' ],
    [ COPY_SHORTCUTS.copyEnglishTransliteration.name, () => transliterations.english, 'english transliteration' ],
    [ COPY_SHORTCUTS.copyHindiTransliteration.name, () => transliterations.hindi, 'hindi transliteration' ],
    [ COPY_SHORTCUTS.copyUrduTransliteration.name, () => transliterations.urdu, 'urdu transliteration' ],
    [ COPY_SHORTCUTS.copyAuthor.name, () => getAuthor(), 'citation' ],
  ].reduce( ( hotkeys, [ name, getContent, fieldName ] ) => ( {
    ...hotkeys,
    [ name ]: () => copyToClipboard( line && getContent(), `No ${fieldName} available to copy` ),
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
