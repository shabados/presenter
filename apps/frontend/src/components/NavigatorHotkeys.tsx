import { noop } from 'lodash'
import { useCallback, useContext, useEffect } from 'react'

import { getJumpLines } from '../helpers/auto-jump'
import { ContentContext, HistoryContext, SettingsContext } from '../helpers/contexts'
import controller from '../services/controller'
import { useCurrentLines, useWindowFocus } from '../hooks'
import { LINE_HOTKEYS, NAVIGATOR_SHORTCUTS } from '../helpers/keyMap'
import { findLineIndex } from '../helpers/line'
import GlobalHotKeys from './GlobalHotKeys'

type NavigatorHotKeysProps = {
  active?: boolean,
  children?: React.ReactNode | null,
  mouseTargetRef?: { current: EventTarget | null },
}

/**
 * Hotkeys for controlling the navigator.
 */
const NavigatorHotKeys = (
  { active = false, children = null, mouseTargetRef = { current: null } }: NavigatorHotKeysProps
) => {
  const { viewedLines } = useContext( HistoryContext )

  const content = useContext( ContentContext )
  const { lineId, mainLineId, nextLineId, shabad, bani } = content
  const lines = useCurrentLines()

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

  const autoToggle = useCallback( () => {
    if ( shabad ) controller.autoToggleShabad( content )
    else if ( bani ) controller.autoToggleBani( content )
  }, [ shabad, bani, content ] )

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

  const goPreviousLine = useCallback( () => {
    if ( !lines ) return

    const currentLineIndex = findLineIndex( lines, lineId )
    const { id } = lines[ currentLineIndex ] || {}

    if ( id && currentLineIndex > 0 ) {
      controller.line( lines[ currentLineIndex - 1 ].id )
    }
  }, [ lines, lineId ] )

  const goNextLine = useCallback( ( {
    target: { nodeName, className: targetClass, parentNode },
  } ) => {
    const { current: mouseTarget } = mouseTargetRef

    /* Near the bottom of the screen the targetClass
    becomes 'controller-container` instead of presenter.
    In this case, we check the targetClass or its parent node's class
    (which if the target is controller container, will be presenter) */
    if (
      // No lines
      !lines
      // Or a hotkey didn't trigger it, and another active element was clicked on
      || ( nodeName !== 'BODY' && ![ targetClass, parentNode.className ].includes( mouseTarget.className ) )
    ) return

    const currentLineIndex = findLineIndex( lines, lineId )
    const { id } = lines[ currentLineIndex ] || {}

    if ( id && currentLineIndex < lines.length - 1 ) {
      controller.line( lines[ currentLineIndex + 1 ].id )
    }
  }, [ lines, lineId, mouseTargetRef ] )

  const goToIndex = ( index ) => {
    if ( !lines ) return

    const jumpLines = getJumpLines( { shabad, bani } )
    const id = jumpLines[ index ]

    controller.line( id )
  }

  /**
   * Prevents the default action from occurring for each handler.
   * @param events An object containing the event names and corresponding handlers.
   */
  const preventDefault = ( events ) => Object.entries( events )
    .reduce( ( events, [ name, handler ] ) => ( {
      ...events,
      [ name ]: ( event ) => event.preventDefault() || handler( event ),
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

  const keyMap = { ...hotkeys, ...numberKeyMap }

  const windowFocused = useWindowFocus()

  // Register mouse shortcuts
  useEffect( () => {
    const { current: mouseTarget } = mouseTargetRef

    if ( !active || !mouseTarget || !windowFocused ) return noop

    type CustomEvent =
      [eventName: string, handler: any]

    const events = [
      [ 'click', goNextLine ],
      [ 'contextmenu', ( event: Event ) => event.preventDefault() ],
      [ 'auxclick', ( { button } ) => ( ( {
        2: goPreviousLine,
        1: autoToggle,
      } )[ button ] || noop )() ],
    ] as CustomEvent[]

    events.forEach( ( [ event, handler ] ) => mouseTarget.addEventListener( event, handler ) )

    return () => events.forEach(
      ( [ event, handler ] ) => mouseTarget.removeEventListener( event, handler ),
    )
  }, [ mouseTargetRef, active, goNextLine, goPreviousLine, autoToggle, windowFocused ] )

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={active ? hotKeyHandlers : {}}>
      {children}
    </GlobalHotKeys>
  )
}

export default NavigatorHotKeys
