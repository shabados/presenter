import React, { useContext } from 'react'
import { node, bool } from 'prop-types'
import { GlobalHotKeys } from 'react-hotkeys'

import { mapPlatformKeys, getJumpLines, findLineIndex } from '../lib/utils'
import controller from '../lib/controller'
import { NAVIGATOR_SHORTCUTS, LINE_HOTKEYS } from '../lib/keyMap'
import { ContentContext, HistoryContext, SettingsContext } from '../lib/contexts'

/**
 * Hotkeys for controlling the navigator.
 */
const NavigatorHotKeys = ( { active, children } ) => {
  const { viewedLines } = useContext( HistoryContext )

  const content = useContext( ContentContext )
  const { lineId, mainLineId, nextLineId, shabad, bani } = content
  const { lines } = shabad || bani || {}

  const goFirstLine = () => {
    if ( !lines ) return

    const [ firstLine ] = lines

    // Go to the previous shabad if the first line is highlighted (but not for banis)
    if ( !bani && lineId === firstLine.id ) controller.previousShabad( shabad.orderId )
    else controller.line( firstLine.id )
  }

  const goLastLine = () => {
    if ( !lines ) return

    const lastLine = lines[ lines.length - 1 ]

    // Go to the next shabad if the last line is highlighted (but not for banis)
    if ( !bani && lineId === lastLine.id ) controller.nextShabad( shabad.orderId )
    else controller.line( lastLine.id )
  }

  const autoToggle = () => {
    if ( shabad ) controller.autoToggleShabad( content )
    else if ( bani ) controller.autoToggleBani( content )
  }

  const restoreLine = () => {
    const ids = Object
      .entries( viewedLines )
      .sort( ( [ , t1 ], [ , t2 ] ) => new Date( t1 ) - new Date( t2 ) )
      .map( ( [ id ] ) => id )

    if ( lineId || !ids ) return

    controller.line( ids[ ids.length - 1 ] )
  }

  const setMainLine = () => lineId && controller.mainLine( lineId )

  const goMainLine = () => mainLineId && controller.line( mainLineId )

  const goJumpLine = () => nextLineId && controller.line( nextLineId )

  const goPreviousLine = () => {
    if ( !lines ) return

    const currentLineIndex = findLineIndex( lines, lineId )
    const { id } = lines[ currentLineIndex ] || {}

    if ( id && currentLineIndex > 0 ) {
      controller.line( lines[ currentLineIndex - 1 ].id )
    }
  }

  const goNextLine = () => {
    if ( !lines ) return

    const currentLineIndex = findLineIndex( lines, lineId )
    const { id } = lines[ currentLineIndex ] || {}

    if ( id && currentLineIndex < lines.length - 1 ) {
      controller.line( lines[ currentLineIndex + 1 ].id )
    }
  }

  const goToIndex = index => {
    if ( !lines ) return

    const jumpLines = getJumpLines( { shabad, bani } )
    const id = jumpLines[ index ]

    controller.line( id )
  }

  /**
   * Prevents the default action from occurring for each handler.
   * @param events An object containing the event names and corresponding handlers.
   */
  const preventDefault = events => Object.entries( events )
    .reduce( ( events, [ name, handler ] ) => ( {
      ...events,
      [ name ]: event => event.preventDefault() || handler( event ),
    } ), {} )

  // Navigation Hotkey Handlers
  const hotKeyHandlers = preventDefault( {
    [ NAVIGATOR_SHORTCUTS.previousLine.name ]: goPreviousLine,
    [ NAVIGATOR_SHORTCUTS.nextLine.name ]: goNextLine,
    [ NAVIGATOR_SHORTCUTS.firstLine.name ]: goFirstLine,
    [ NAVIGATOR_SHORTCUTS.lastLine.name ]: goLastLine,
    [ NAVIGATOR_SHORTCUTS.autoToggle.name ]: autoToggle,
    [ NAVIGATOR_SHORTCUTS.restoreLine.name ]: restoreLine,
    [ NAVIGATOR_SHORTCUTS.setMainLine.name ]: setMainLine,
    [ NAVIGATOR_SHORTCUTS.goJumpLine.name ]: goJumpLine,
    [ NAVIGATOR_SHORTCUTS.goMainLine.name ]: goMainLine,
    ...LINE_HOTKEYS.reduce( ( handlers, key, i ) => ( {
      ...handlers,
      [ key ]: () => goToIndex( i ),
    } ), {} ),
  } )

  const numberKeyMap = LINE_HOTKEYS.reduce( ( keymap, hotkey ) => ( {
    ...keymap,
    [ hotkey ]: [ hotkey ],
  } ), {} )

  const settings = useContext( SettingsContext )
  const { local: { hotkeys } } = settings || {}

  const keyMap = mapPlatformKeys( { ...hotkeys, ...numberKeyMap } )

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={active ? hotKeyHandlers : {}}>
      {children}
    </GlobalHotKeys>
  )
}


NavigatorHotKeys.propTypes = {
  active: bool,
  children: node,
}

NavigatorHotKeys.defaultProps = {
  active: false,
  children: null,
}

export default NavigatorHotKeys
