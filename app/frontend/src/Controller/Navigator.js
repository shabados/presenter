/* eslint-disable react/no-multi-comp */

import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { string, func, shape, arrayOf, bool } from 'prop-types'
import { location } from 'react-router-prop-types'
import classNames from 'classnames'

import { GlobalHotKeys } from 'react-hotkeys'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import {
  faChevronUp,
  faChevronDown,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons'

import { LINE_HOTKEYS, NAVIGATOR_SHORTCUTS } from '../lib/keyMap'
import { CONTROLLER_URL } from '../lib/consts'
import { stripPauses } from '../lib/utils'
import controller from '../lib/controller'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import ToolbarButton from './ToolbarButton'

import './Navigator.css'

/**
* Line component that attaches click handlers.
* @param gurmukhi The Gurmukhi for the line to render.
* @param id The id of the line.
* @param index The index of the line.
*/
const NavigatorLine = ( { id, register, focused, gurmukhi, hotkey } ) => {
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
      <span className="hotkey meta">{hotkey}</span>
      <span className="gurmukhi text">{stripPauses( gurmukhi )}</span>
    </ListItem>
  )
}

NavigatorLine.propTypes = {
  register: func.isRequired,
  gurmukhi: string.isRequired,
  focused: bool.isRequired,
  id: string.isRequired,
  hotkey: string,
}

NavigatorLine.defaultProps = {
  hotkey: null,
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

  jumpFirstLine = () => {
    const { focused, shabad, bani } = this.props
    const { lines: [ firstLine ] } = shabad || bani

    // Go to the previous shabad if the first line is highlighted (but not for banis)
    if ( !bani && focused === firstLine.id ) controller.previousShabad( shabad.orderId )
    else controller.line( firstLine.id )
  }

  jumpLastLine = () => {
    const { focused, shabad, bani } = this.props
    const { lines } = shabad || bani
    const lastLine = lines[ lines.length - 1 ]

    // Go to the next shabad if the last line is highlighted (but not for banis)
    if ( !bani && focused === lastLine.id ) controller.nextShabad( shabad.orderId )
    else controller.line( lastLine.id )
  }

  autoToggle = () => {
    const { shabad } = this.props

    if ( shabad ) controller.autoToggleShabad( this.props )
    // Todo: For banis, just jump to the next section, or do nothing?
  }

  handlers = {
    [ NAVIGATOR_SHORTCUTS.firstLine.name ]: this.jumpFirstLine,
    [ NAVIGATOR_SHORTCUTS.lastLine.name ]: this.jumpLastLine,
    [ NAVIGATOR_SHORTCUTS.autoToggle.name ]: this.autoToggle,
  }

  render() {
    const { location, shabad, bani, register, focused, settings } = this.props

    const { local: { hotkeys } } = settings
    const content = shabad || bani

    // If there's no Shabad to show, go back to the controller
    if ( !content ) {
      return <Redirect to={{ ...location, pathname: CONTROLLER_URL }} />
    }

    const { lines } = content
    return (
      <GlobalHotKeys handlers={this.handlers} keyMap={hotkeys}>
        <List className="navigator" onKeyDown={e => e.preventDefault()}>
          {lines.map( ( line, index ) => (
            <NavigatorLine
              key={line.id}
              {...line}
              focused={line.id === focused}
              hotkey={LINE_HOTKEYS[ index ]}
              register={register}
            />
          ) )}
        </List>
      </GlobalHotKeys>
    )
  }
}

Navigator.propTypes = {
  lineId: string,
  updateFocus: func.isRequired,
  register: func.isRequired,
  location: location.isRequired,
  focused: string,
  shabad: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  bani: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  settings: shape( { local: shape( { hotkeys: shape( {} ) } ) } ).isRequired,
}

Navigator.defaultProps = {
  shabad: undefined,
  bani: undefined,
  lineId: undefined,
  focused: undefined,
}

/**
 * Used by Menu parent to render content in the bottom bar.
 */
export const Bar = props => {
  const { lineId, shabad, bani } = props
  const content = shabad || bani

  if ( !content ) return null

  const { lines } = content

  const currentLine = lines.find( ( { id } ) => id === lineId )

  const onUpClick = () => {
    const firstLine = lines[ 0 ]
    // Go to the previous shabad if the first line is highlighted (but not for banis)
    if ( !bani && lineId === firstLine.id ) controller.previousShabad( shabad.orderId )
    else controller.previousLine( currentLine.orderId )
  }

  const onDownClick = () => {
    const lastLine = lines[ lines.length - 1 ]
    // Go to the previous shabad if the first line is highlighted (but not for banis)
    if ( !bani && lineId === lastLine.id ) controller.nextShabad( shabad.orderId )
    else controller.nextLine( currentLine.orderId )
  }

  const onAutoToggle = () => controller.autoToggleShabad( props )

  return (
    <div className="navigator-controls">
      <ToolbarButton name="Up" icon={faChevronUp} onClick={onUpClick} />
      {lines ? `${lines.findIndex( ( { id } ) => id === lineId ) + 1}/${lines.length}` : null}
      <ToolbarButton name="Down" icon={faChevronDown} onClick={onDownClick} />
      {shabad && <ToolbarButton className="autoselect" name="Autoselect" icon={faExchangeAlt} onClick={onAutoToggle} />}
    </div>
  )
}

Bar.propTypes = {
  lineId: string,
  shabad: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  bani: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
}

Bar.defaultProps = {
  lineId: undefined,
  shabad: undefined,
  bani: undefined,
}

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
  clickOnFocus: true,
} )( Navigator )
