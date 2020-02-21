import { useContext } from 'react'
import { invert } from 'lodash'
import copy from 'copy-to-clipboard'
import { useSnackbar } from 'notistack'

import { getTranslation, getTransliteration, findLineIndex } from './utils'
import { ContentContext, RecommendedSourcesContext, SettingsContext } from './contexts'
import { LANGUAGES } from './consts'

const languagesById = invert( LANGUAGES )

export const useCurrentLines = () => {
  const { shabad, bani } = useContext( ContentContext )

  const { lines = [] } = shabad || bani || {}

  return lines
}

export const useCurrentLine = () => {
  const { lineId, shabad, bani } = useContext( ContentContext )
  const { lines = [] } = shabad || bani || {}

  // Find the correct line in the Shabad
  const lineIndex = findLineIndex( lines, lineId )
  const line = lineIndex > -1 ? lines[ lineIndex ] : null

  return [ line, lineIndex ]
}

export const useTranslations = languageIds => {
  const { shabad } = useContext( ContentContext )
  const [ line ] = useCurrentLine()

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

export const useTransliterations = languageIds => {
  const [ line ] = useCurrentLine()

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
