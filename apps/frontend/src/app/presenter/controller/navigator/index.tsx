/* eslint-disable react/no-multi-comp */

import './index.css'

import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faCheck,
  faChevronDown,
  faChevronUp,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { createFileRoute, useLocation } from '@tanstack/react-router'
import classNames from 'classnames'
import { stripVishraams } from 'gurmukhi-utils'
import { invert } from 'lodash'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import GlobalHotKeys from '~/components/GlobalHotKeys'
import { withNavigationHotkeys } from '~/components/NavigationHotkeys'
import NavigatorHotKeys from '~/components/NavigatorHotkeys'
import { getJumpLines, getNextJumpLine } from '~/helpers/auto-jump'
import { ContentContext, HistoryContext } from '~/helpers/contexts'
import { LINE_HOTKEYS } from '~/helpers/keyMap'
import { findLineIndex } from '~/helpers/line'
import { useCurrentLines } from '~/hooks'
import controller from '~/services/controller'

import ToolbarButton from '../-components/ToolbarButton'
import ShabadInfo from './-components/ShabadInfo'

type NavigatorLineProps = {
  register: ( id, line, ) => any,
  gurmukhi: string,
  focused: boolean,
  next: boolean,
  main: boolean,
  id: string,
  hotkey?: string | null,
  timestamp?: string | null,
}

const NavigatorLine = ( {
  id,
  register,
  focused,
  gurmukhi,
  hotkey = null,
  main,
  next,
  timestamp = null,
}: NavigatorLineProps ) => {
  // Move to the line id on click
  const onClick = () => controller.line( id )

  // Register the reference to the line with the NavigationHotKey HOC
  const registerLine = ( line ) => register( id, line, true )

  return (
    <ListItem
      key={id}
      className={classNames( { focused } )}
      onClick={onClick}
      ref={registerLine}
      tabIndex={0}
    >
      <span className={classNames( { main, next }, 'hotkey', 'meta' )}>
        {!( main || next ) && hotkey}
        {main && <FontAwesomeIcon icon={faAngleDoubleLeft} />}
        {next && <FontAwesomeIcon icon={faAngleDoubleRight} />}
      </span>

      <span className="gurmukhi text">{stripVishraams( gurmukhi )}</span>

      <span className="timestamp meta">
        {timestamp && (
          <>
            {new Date( timestamp ).toLocaleTimeString( navigator.language, { hour: '2-digit', minute: '2-digit', hour12: false } )}
            <FontAwesomeIcon className="icon" icon={faCheck} />
          </>
        )}
      </span>
    </ListItem>
  )
}

type NavigatorProps = {
  updateFocus: () => any,
  register: () => any,
  focused?: string,
}

const Navigator = ( { updateFocus, register, focused }: NavigatorProps ) => {
  const { viewedLines } = useContext( HistoryContext )

  const content = useContext( ContentContext )
  const { shabad, bani, lineId, mainLineId } = content

  const lines = useCurrentLines()

  // Set the focus to the active line when it changes
  useEffect( () => { updateFocus( lineId, false ) }, [ lineId, updateFocus ] )

  const goToIndex = useCallback( ( index ) => {
    const jumpLines = getJumpLines( { shabad, bani } )
    updateFocus( jumpLines[ index ] )
  }, [ updateFocus, shabad, bani ] )

  // Navigation Hotkey Handlers
  const hotKeyHandlers = useMemo( () => ( {
    ...LINE_HOTKEYS.reduce( ( handlers, key, i ) => ( {
      ...handlers,
      [ key ]: () => goToIndex( i ),
    } ), {} ),
  } ), [ goToIndex ] )

  const numberKeyMap = useMemo( () => LINE_HOTKEYS.reduce( ( keymap, hotkey ) => ( {
    ...keymap,
    [ hotkey ]: [ hotkey ],
  } ), {} ), [] )

  // If there's no Shabad to show, go back to the controller
  // if ( !lines.length ) return <Navigate to={{ ...location, pathname: SEARCH_URL }} replace />

  const jumpLines = invert( getJumpLines( content ) )
  const nextLineId = getNextJumpLine( content )

  return (
    <GlobalHotKeys keyMap={numberKeyMap} handlers={hotKeyHandlers}>
      <List className="navigator" onKeyDown={( e ) => e.preventDefault()}>
        {lines.map( ( line ) => (
          <NavigatorLine
            key={line.id}
            {...line}
            focused={line.id === focused}
            main={mainLineId === line.id}
            next={nextLineId === line.id}
            hotkey={LINE_HOTKEYS[ jumpLines[ line.id ] ]}
            register={register}
            timestamp={viewedLines[ line.id ]}
          />
        ) ) }
      </List>
    </GlobalHotKeys>
  )
}

const NavigatorNavigationHotkeys = withNavigationHotkeys( {
  arrowKeys: true,
  lineKeys: true,
  clickOnFocus: true,
  wrapAround: false,
  keymap: {
    first: null,
    last: null,
  },
} )( Navigator )

// Wrap NavigationHotkeys first so that it takes precedence
const NavigatorWithAllHotKeys = ( props ) => (
  <NavigatorHotKeys {...props} active>
    <NavigatorNavigationHotkeys {...props} />
  </NavigatorHotKeys>
)

type BarProps = {
  onHover: ( text: string | null ) => Record<string, any>,
}

/**
 * Used by Menu parent to render content in the bottom bar.
 */
export const Bar = ( { onHover }: BarProps ) => {
  const [ autoSelectHover, setAutoSelectHover ] = useState( false )

  const content = useContext( ContentContext )
  const { lineId, shabad, bani, mainLineId } = content
  const { lines } = shabad || bani || {}

  if ( !lines ) return null

  const currentLineIndex = findLineIndex( lines, lineId )
  const currentLine = lines[ currentLineIndex ]

  const resetHover = () => onHover( null )

  const onUpClick = () => {
    if ( !currentLine ) return

    const firstLine = lines[ 0 ]
    // Go to the previous shabad if the first line is highlighted (but not for banis)
    if ( lineId === firstLine.id ) {
      if ( bani ) return

      controller.previousShabad( shabad.orderId )
    } else controller.line( lines[ currentLineIndex - 1 ].id )
  }

  const onDownClick = () => {
    if ( !currentLine ) return

    const lastLine = lines[ lines.length - 1 ]

    // Go to the previous shabad if the first line is highlighted (but not for banis)
    if ( lineId === lastLine.id ) {
      if ( bani ) return

      controller.nextShabad( shabad.orderId )
    } else controller.line( lines[ currentLineIndex + 1 ].id )
  }

  const onAutoToggle = () => {
    if ( shabad ) controller.autoToggleShabad( content )
    else if ( bani ) controller.autoToggleBani( content )
  }

  const onAutoSelectHover = () => {
    onHover( 'Autoselect' )
    setAutoSelectHover( true )
  }

  const resetAutoSelectHover = () => {
    resetHover()
    setAutoSelectHover( false )
  }

  const shabadAutoSelectIcon = () => {
    if ( autoSelectHover ) {
      return mainLineId === lineId ? faAngleDoubleRight : faAngleDoubleLeft
    }

    return faExchangeAlt
  }

  const baniAutoSelectIcon = () => ( autoSelectHover ? faAngleDoubleRight : faExchangeAlt )

  const autoSelectIcon = shabad ? shabadAutoSelectIcon : baniAutoSelectIcon

  return (
    <div className="navigator-controls">
      <ToolbarButton
        name="Up"
        className="arrow"
        icon={faChevronUp}
        onMouseEnter={() => onHover( 'Previous Line' )}
        onMouseLeave={resetHover}
        onClick={onUpClick}
      />

      {currentLine && <ShabadInfo />}

      <ToolbarButton
        name="Down"
        className="arrow"
        icon={faChevronDown}
        onMouseEnter={() => onHover( 'Next Line' )}
        onMouseLeave={resetHover}
        onClick={onDownClick}
      />

      <ToolbarButton
        className="autoselect"
        name="Autoselect"
        onMouseEnter={onAutoSelectHover}
        onMouseLeave={resetAutoSelectHover}
        icon={autoSelectIcon()}
        onClick={onAutoToggle}
      />
    </div>
  )
}

export const Route = createFileRoute( '/presenter/controller/navigator/' )( {
  component: NavigatorWithAllHotKeys,

} )
