import copy from 'copy-to-clipboard'
import { useSnackbar } from 'notistack'
import { useContext, useEffect, useState } from 'react'

import { isMac } from './consts'
import { ContentContext, RecommendedSourcesContext, SettingsContext } from './contexts'
import { findLineIndex, getTranslations } from './line'

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

export const useTranslations = ( languageIds ) => {
  const { shabad } = useContext( ContentContext )
  const [ line ] = useCurrentLine()

  const recommendedSources = useContext( RecommendedSourcesContext )
  const { local: { sources } = {} } = useContext( SettingsContext )

  return getTranslations( { shabad, line, recommendedSources, sources, languageIds } )
}

export const useCopyToClipboard = () => {
  const truncate = ( input ) => ( input.length > 30 ? `${input.substring( 0, 30 )}...` : input )

  const { enqueueSnackbar } = useSnackbar()
  return ( text, fallback = 'No text to copy' ) => {
    if ( text ) {
      // Double copying due to bug: https://github.com/sudodoki/copy-to-clipboard/issues/90
      copy( text )
      copy( text )
    }

    enqueueSnackbar(
      text ? `Copied "${truncate( text )}" to clipboard` : fallback,
      { autoHideDuration: 1000, preventDuplicate: true },
    )
  }
}

export const useWindowFocus = () => {
  const [ focused, setFocused ] = useState( document.hasFocus() )

  // Keep track of whether the window is focused
  useEffect( () => {
    // Use click to determine focus on non-Mac platforms
    const focusEvent = isMac ? 'focus' : 'click'
    const onBlur = () => setFocused( false )
    const onFocus = () => setFocused( true )

    window.addEventListener( 'blur', onBlur )
    window.addEventListener( focusEvent, onFocus )

    return () => {
      window.removeEventListener( 'blur', onBlur )
      window.removeEventListener( focusEvent, onFocus )
    }
  }, [ setFocused ] )

  return focused
}
