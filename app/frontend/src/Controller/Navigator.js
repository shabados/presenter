/* eslint-disable react/no-multi-comp */

import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { string, func, shape, arrayOf, bool } from 'prop-types'
import { location } from 'react-router-prop-types'
import classNames from 'classnames'

import { List, ListItem } from '@material-ui/core'
import {
  faChevronUp,
  faChevronDown,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons'

import { CONTROLLER_URL, LINE_HOTKEYS } from '../lib/consts'
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
class NavigatorLine extends PureComponent {
  // Move to the line id on click
  onClick = () => {
    const { id } = this.props
    controller.line( id )
  }

  // Register the reference to the line with the NavigationHotKey HOC
  register = line => {
    const { register, id } = this.props
    register( id, line, true )
  }

  render() {
    const { focused, gurmukhi, id, hotkey } = this.props

    return (
      <ListItem
        key={id}
        className={classNames( { focused } )}
        onClick={this.onClick}
        ref={this.register}
        tabIndex={0}
      >
        <span className="hotkey meta">{hotkey}</span>
        <span className="gurmukhi text">{stripPauses( gurmukhi )}</span>
      </ListItem>
    )
  }
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

  render() {
    const { location, shabad, bani, lineId, register, focused } = this.props
    const content = shabad || bani

    // If there's no Shabad to show, go back to the controller
    if ( !content ) {
      return <Redirect to={{ ...location, pathname: CONTROLLER_URL }} />
    }

    const { lines } = content
    return (
      <List className="navigator" onKeyDown={e => e.preventDefault()}>
        {lines.map( ( line, index ) => (
          <NavigatorLine
            {...line}
            focused={line.id === focused}
            hotkey={LINE_HOTKEYS[ index ]}
            register={register}
          />
        ) )}
      </List>
    )
  }
}

Navigator.propTypes = {
  lineId: string,
  updateFocus: func.isRequired,
  register: func.isRequired,
  location: location.isRequired,
  shabad: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  bani: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
}

Navigator.defaultProps = {
  shabad: undefined,
  bani: undefined,
  lineId: undefined,
}

/**
 * Used by Menu parent to render content in the bottom bar.
 */
export const Bar = ( { mainLineId, lineId, shabad, bani } ) => {
  console.log( mainLineId )
  const content = shabad || bani

  if ( !content ) return null

  const autoselectProps = {
    icon: faExchangeAlt,
    onClick: () => controller.mainLine( lineId ),
  }

  const { lines } = content

  return (
    <div className="navigator-controls">
      <ToolbarButton name="Up" icon={faChevronUp} />
      {lines ? `${lines.findIndex( ( { id } ) => id === lineId ) + 1}/${lines.length}` : null}
      <ToolbarButton name="Down" icon={faChevronDown} />
      <ToolbarButton name="Autoselect" className="autoselect" {...autoselectProps} />
    </div>
  )
}

Bar.propTypes = {
  mainLineId: string,
  lineId: string,
  shabad: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  bani: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
}

Bar.defaultProps = {
  mainLineId: undefined,
  lineId: undefined,
  shabad: undefined,
  bani: undefined,
}

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
  clickOnFocus: true,
} )( Navigator )
