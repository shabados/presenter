import React, { useContext } from 'react'
import { node } from 'prop-types'
import { toUnicode, stripVishraams } from 'gurmukhi-utils'
import { mapValues } from 'lodash'

import { SettingsContext, ContentContext, WritersContext, RecommendedSourcesContext } from '../lib/contexts'
import { customiseLine, getTransliterators } from '../lib/line'
import { COPY_SHORTCUTS } from '../lib/keyMap'
import { useCopyToClipboard, useCurrentLine, useTranslations, useCurrentLines } from '../lib/hooks'
import { LANGUAGES, SOURCE_ABBREVIATIONS } from '../lib/consts'

import GlobalHotKeys from './GlobalHotKeys'

const CopyHotkeys = ( { children } ) => {
  const { local: { hotkeys, display: { lineEnding } } } = useContext( SettingsContext )
  const lines = useCurrentLines()
  const [ line ] = useCurrentLine()
  const { typeId } = line || {}

  // Get Shabad, writer, sources for getting the author
  const { shabad } = useContext( ContentContext )
  const writers = useContext( WritersContext )
  const recommendedSources = useContext( RecommendedSourcesContext )

  // Get all translations
  const translations = mapValues(
    useTranslations( [
      LANGUAGES.english,
      LANGUAGES.punjabi,
      LANGUAGES.spanish,
    ] ),
    line => customiseLine( line, { lineEnding, typeId } ),
  )

  // Get all transliterators
  const transliterators = mapValues(
    getTransliterators( [
      LANGUAGES.english,
      LANGUAGES.hindi,
      LANGUAGES.urdu,
    ] ),
    transliterate => () => transliterate( customiseLine( line.gurmukhi, { lineEnding, typeId } ) ),
  )

  const getAuthor = () => {
    if ( !line ) return ''

    const { sourceId, writerId } = shabad || line.shabad
    const { sourcePage } = line

    const { pageNameEnglish: pageName } = recommendedSources[ sourceId ]
    const { nameEnglish: writerName } = writers[ writerId ]

    return `${writerName} - ${SOURCE_ABBREVIATIONS[ sourceId ]} - ${pageName} ${sourcePage}`
  }

  const getAllLines = () => lines.map( ( { gurmukhi } ) => gurmukhi ).join( ' ' )

  const copyToClipboard = useCopyToClipboard()

  // Generate hotkeys for copying to clipboard
  const hotkeyHandlers = [
    [ COPY_SHORTCUTS.copyGurmukhiAscii.name, () => stripVishraams( line.gurmukhi ), 'gurmukhi' ],
    [ COPY_SHORTCUTS.copyGurmukhiUnicode.name, () => stripVishraams( toUnicode( line.gurmukhi ) ), 'gurmukhi' ],
    [ COPY_SHORTCUTS.copyAllLinesAscii.name, () => stripVishraams( getAllLines() ), 'lines' ],
    [ COPY_SHORTCUTS.copyAllLinesUnicode.name, () => stripVishraams( toUnicode( getAllLines() ) ), 'lines' ],
    [ COPY_SHORTCUTS.copyEnglishTranslation.name, () => translations[ LANGUAGES.english ], 'english translation' ],
    [ COPY_SHORTCUTS.copyPunjabiTranslation.name, () => translations[ LANGUAGES.punjabi ], 'punjabi translation' ],
    [ COPY_SHORTCUTS.copySpanishTranslation.name, () => translations[ LANGUAGES.spanish ], 'spanish translation' ],
    [ COPY_SHORTCUTS.copyEnglishTransliteration.name, () => stripVishraams( transliterators[ LANGUAGES.english ]() ), 'english transliteration' ],
    [ COPY_SHORTCUTS.copyHindiTransliteration.name, () => stripVishraams( transliterators[ LANGUAGES.hindi ]() ), 'hindi transliteration' ],
    [ COPY_SHORTCUTS.copyUrduTransliteration.name, () => stripVishraams( transliterators[ LANGUAGES.urdu ]() ), 'urdu transliteration' ],
    [ COPY_SHORTCUTS.copyCitation.name, () => getAuthor(), 'citation' ],
  ].reduce( ( hotkeys, [ name, getContent, fieldName ] ) => ( {
    ...hotkeys,
    [ name ]: () => copyToClipboard( line && getContent(), `No ${fieldName} available to copy` ),
  } ), {} )
  return (
    <GlobalHotKeys keyMap={hotkeys} handlers={hotkeyHandlers}>
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
