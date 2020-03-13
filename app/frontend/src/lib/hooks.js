import { useContext } from 'react'
import { invert } from 'lodash'
import copy from 'copy-to-clipboard'
import { useSnackbar } from 'notistack'

import { getTranslation, getTransliteration, findLineIndex } from './utils'
import { ContentContext, RecommendedSourcesContext, SettingsContext } from './contexts'
import { LANGUAGES } from './consts'

const languagesById = invert( LANGUAGES )

export const useLines = () => {
  const { shabad, bani } = useContext( ContentContext )

  const { lines = [] } = shabad || bani || {}

  return lines
}

export const useLine = lineId => {
  const { shabad, bani } = useContext( ContentContext )
  const { lines = [] } = shabad || bani || {}

  // Find the correct line in the Shabad
  const lineIndex = findLineIndex( lines, lineId )
  const line = lineIndex > -1 ? lines[ lineIndex ] : null

  return [ line, lineIndex ]
}

export const useCurrentLineIn = hookFn => {
  const { lineId } = useContext( ContentContext )

  return hookFn( lineId )
}

export const useTranslations = languageIds => lineId => {
  const { shabad } = useContext( ContentContext )
  const [ line ] = useLine( lineId )

  const recommendedSources = useContext( RecommendedSourcesContext )
  const { local: { sources } = {} } = useContext( SettingsContext )

  return ( languageIds || [] ).filter( x => x ).reduce( ( translations, languageId ) => ( {
    ...translations,
    [ languagesById[ languageId ] ]: line && getTranslation( {
      shabad,
      line,
      sources,
      recommendedSources,
      languageId,
    } ),
  } ), {} )
}

export const useTransliterations = languageIds => lineId => {
  const [ line ] = useLine( lineId )

  return ( languageIds || [] ).filter( x => x ).reduce( ( translations, languageId ) => ( {
    ...translations,
    [ languagesById[ languageId ] ]: line && getTransliteration( line, languageId ),
  } ), {} )
}

export const useCopyToClipboard = () => {
  const truncate = input => ( input.length > 30 ? `${input.substring( 0, 30 )}...` : input )

  const { enqueueSnackbar } = useSnackbar()

  return ( text, fallback = 'No text to copy' ) => {
    if ( text ) copy( text )

    enqueueSnackbar(
      text ? `Copied "${truncate( text )}" to clipboard` : fallback,
      { autoHideDuration: 1000, preventDuplicate: true },
    )
  }
}
