/* eslint-disable react/no-multi-comp */

import React, { PureComponent, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { string, func, shape, arrayOf, bool, objectOf } from 'prop-types'
import { location } from 'react-router-prop-types'
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
import { stripPauses, getJumpLines, getNextJumpLine } from '../lib/utils'
import controller from '../lib/controller'
import { LINE_HOTKEYS } from '../lib/keyMap'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'
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
          {new Date( timestamp ).toLocaleTimeString( navigator.language, { hour: '2-digit', minute: '2-digit' } )}
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
class Navigator extends PureComponent {
  componentDidMount() {
    const { updateFocus, lineId } = this.props

    // Set the focus to the active line
    updateFocus( lineId, false )
  }

  componentDidUpdate( { lineId: prevLineId } ) {
    const { lineId, updateFocus } = this.props

    // Update the focus to any new lines
    if ( lineId !== prevLineId ) {
      updateFocus( lineId, false )
    }
  }

  goToIndex = index => {
    const { updateFocus } = this.props

    const jumpLines = getJumpLines( this.props )

    updateFocus( jumpLines[ index ] )
  }

    // Navigation Hotkey Handlers
    hotKeyHandlers = ( {
      ...LINE_HOTKEYS.reduce( ( handlers, key, i ) => ( {
        ...handlers,
        [ key ]: () => this.goToIndex( i ),
      } ), {} ),
    } )

    numberKeyMap = LINE_HOTKEYS.reduce( ( keymap, hotkey ) => ( {
      ...keymap,
      [ hotkey ]: [ hotkey ],
    } ), {} )


    render() {
      const { location, shabad, bani, register, focused, mainLineId, viewedLines } = this.props

      const content = shabad || bani

      // If there's no Shabad to show, go back to the controller
      if ( !content ) {
        return <Redirect to={{ ...location, pathname: SEARCH_URL }} />
      }

      const jumpLines = invert( getJumpLines( { shabad, bani } ) )
      const nextLineId = getNextJumpLine( this.props )

      const { lines } = content
      return (
        <GlobalHotKeys keyMap={this.numberKeyMap} handlers={this.hotKeyHandlers}>
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
            ) )}
          </List>
        </GlobalHotKeys>
      )
    }
}

Navigator.propTypes = {
  lineId: string,
  mainLineId: string,
  nextLineId: string,
  updateFocus: func.isRequired,
  register: func.isRequired,
  location: location.isRequired,
  focused: string,
  viewedLines: objectOf( string ),
  shabad: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  bani: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
}

Navigator.defaultProps = {
  shabad: undefined,
  bani: undefined,
  lineId: undefined,
  mainLineId: undefined,
  nextLineId: undefined,
  focused: undefined,
  viewedLines: {},
}

const NavigatorWithNavigationHotKeys = withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
  clickOnFocus: true,
  wrapAround: false,
} )( Navigator )

// Wrap withNavigationHotKeys first so that it takes precedence
const NavigatorWithAllHotKeys = props => (
  <NavigatorHotKeys {...props} active>
    <NavigatorWithNavigationHotKeys {...props} />
  </NavigatorHotKeys>
)

export default NavigatorWithAllHotKeys

/**
 * Used by Menu parent to render content in the bottom bar.
 */
export const Bar = props => {
  const [ autoSelectHover, setAutoSelectHover ] = useState( false )

  const { lineId, shabad, bani, onHover, mainLineId } = props
  const content = shabad || bani

  if ( !content ) return null

  const { lines } = content

  const currentLineIndex = lines.findIndex( ( { id } ) => id === lineId )
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
    if ( shabad ) controller.autoToggleShabad( props )
    else if ( bani ) controller.autoToggleBani( props )
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
        {lines
          ? `${lines.findIndex( ( { id } ) => id === lineId ) + 1}/${lines.length}`
          : null}
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
  lineId: string,
  mainLineId: string,
  shabad: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  bani: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  onHover: func,
}

Bar.defaultProps = {
  lineId: undefined,
  mainLineId: undefined,
  shabad: undefined,
  bani: undefined,
  onHover: () => {},
}
