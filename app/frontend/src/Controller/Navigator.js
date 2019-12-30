/* eslint-disable react/no-multi-comp */

import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import { string, func, bool } from 'prop-types'
import classNames from 'classnames'
import { invert } from 'lodash'
import { GlobalHotKeys } from 'react-hotkeys'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronUp,
  faChevronDown,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faExchangeAlt,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'

import { SEARCH_URL } from '../lib/consts'
import { stripPauses, getJumpLines, getNextJumpLine, findLineIndex } from '../lib/utils'
import controller from '../lib/controller'
import { LINE_HOTKEYS } from '../lib/keyMap'
import { ContentContext, HistoryContext } from '../lib/contexts'

import { withNavigationHotkeys } from '../shared/NavigationHotkeys'
import NavigatorHotKeys from '../shared/NavigatorHotkeys'

import ToolbarButton from './ToolbarButton'

import './Navigator.css'

/**
* Line component that attaches click handlers.
* @param gurmukhi The Gurmukhi for the line to render.
* @param id The id of the line.
* @param index The index of the line.
*/
const NavigatorLine = ( {
  id,
  register,
  focused,
  gurmukhi,
  hotkey,
  main,
  next,
  timestamp,
} ) => {
  // Move to the line id on click
  const onClick = () => controller.line( id )

  // Register the reference to the line with the NavigationHotKey HOC
  const registerLine = line => register( id, line, true )

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

      <span className="gurmukhi text">{stripPauses( gurmukhi )}</span>

      {timestamp && (
        <span className="timestamp meta">
          {new Date( timestamp ).toLocaleTimeString( navigator.language, { hour: '2-digit', minute: '2-digit', hour12: false } )}
          <FontAwesomeIcon className="icon" icon={faCheck} />
        </span>
      )}
    </ListItem>
  )
}

NavigatorLine.propTypes = {
  register: func.isRequired,
  gurmukhi: string.isRequired,
  focused: bool.isRequired,
  next: bool.isRequired,
  main: bool.isRequired,
  id: string.isRequired,
  hotkey: string,
  timestamp: string,
}

NavigatorLine.defaultProps = {
  hotkey: null,
  timestamp: null,
}

/**
 * Navigator Component.
 * Displays lines from Shabad and allows navigation.
 */
const Navigator = ( { updateFocus, register, focused } ) => {
  const location = useLocation()

  const { viewedLines } = useContext( HistoryContext )

  const content = useContext( ContentContext )
  const { shabad, bani, lineId, mainLineId } = content

  const { lines } = bani || shabad || {}

  // Set the focus to the active line when it changes
  useEffect( () => { updateFocus( lineId, false ) }, [ lineId, updateFocus ] )

  const goToIndex = useCallback( index => {
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
  if ( !lines ) return <Redirect to={{ ...location, pathname: SEARCH_URL }} />

  const jumpLines = invert( getJumpLines( content ) )
  const nextLineId = getNextJumpLine( content )

  return (
    <GlobalHotKeys keyMap={numberKeyMap} handlers={hotKeyHandlers}>
      <List className="navigator" onKeyDown={e => e.preventDefault()}>
        {lines.map( line => (
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

Navigator.propTypes = {
  updateFocus: func.isRequired,
  register: func.isRequired,
  focused: string,
}

Navigator.defaultProps = {
  focused: undefined,
}

const NavigatorNavigationHotkeys = withNavigationHotkeys( {
  arrowKeys: true,
  lineKeys: true,
  clickOnFocus: true,
  wrapAround: false,
} )( Navigator )

// Wrap NavigationHotkeys first so that it takes precedence
const NavigatorWithAllHotKeys = props => (
  <NavigatorHotKeys {...props} active>
    <NavigatorNavigationHotkeys {...props} />
  </NavigatorHotKeys>
)

export default NavigatorWithAllHotKeys

/**
 * Used by Menu parent to render content in the bottom bar.
 */
export const Bar = ( { onHover } ) => {
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
    if ( !bani && lineId === firstLine.id ) controller.previousShabad( shabad.orderId )
    else controller.line( lines[ currentLineIndex - 1 ].id )
  }

  const onDownClick = () => {
    if ( !currentLine ) return

    const lastLine = lines[ lines.length - 1 ]
    // Go to the previous shabad if the first line is highlighted (but not for banis)
    if ( !bani && lineId === lastLine.id ) controller.nextShabad( shabad.orderId )
    else controller.line( lines[ currentLineIndex + 1 ].id )
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
        icon={faChevronUp}
        onMouseEnter={() => onHover( 'Previous Line' )}
        onMouseLeave={resetHover}
        onClick={onUpClick}
      />

      <span className="line-counter">
        {`${findLineIndex( lines, lineId ) + 1}/${lines.length}`}
      </span>

      <ToolbarButton
        name="Down"
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

Bar.propTypes = {
  onHover: func,
}

Bar.defaultProps = {
  onHover: () => {},
}
