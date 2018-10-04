import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { List, ListItem } from '@material-ui/core'
import {
  faChevronUp,
  faChevronDown,
  // faThumbtack,
  faExchangeAlt,
} from '@fortawesome/fontawesome-free-solid'

import { CONTROLLER_URL, LINE_HOTKEYS } from '../lib/consts'
import { stripPauses } from '../lib/utils'
import controller from '../lib/controller'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import ToolbarButton from './ToolbarButton'

import './Navigator.css'

/**
 * Navigator Component.
 * Displays lines from Shabad and allows navigation.
 */
class Navigator extends Component {
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

  /**
   * Line component that attaches click handlers.
   * @param gurmukhi The Gurmukhi for the line to render.
   * @param id The id of the line.
   * @param index The index of the line.
   */
  Line = ( { gurmukhi, id }, index ) => {
    const { lineId, register } = this.props

    // Check if the line being rendered is the currently displayed line
    const activeLine = id === lineId

    // Set the class name appropriately for the active line
    const className = activeLine ? 'focused' : ''

    // Register the reference to the line with the NavigationHotKey HOC
    const ref = line => register( id, line )

    // Move to the line id on click
    const onClick = () => controller.line( id )

    return (
      <ListItem key={id} className={className} onClick={onClick} ref={ref} tabIndex={0}>
        <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
        <span className="gurmukhi text">{stripPauses( gurmukhi )}</span>
      </ListItem>
    )
  }


  render() {
    const { location, shabad, bani } = this.props
    const content = shabad || bani

    // If there's no Shabad to show, go back to the controller
    if ( !content ) {
      return <Redirect to={{ ...location, pathname: CONTROLLER_URL }} />
    }

    const { lines } = content
    return (
      <List className="navigator">
        {lines.map( this.Line )}
      </List>
    )
  }
}


/**
 * Used by Menu parent to render content in the bottom bar.
 */
export const Bar = ( { mainLineId, lineId, shabad, bani } ) => {
  console.log( mainLineId )
  const content = shabad || bani

  if ( !content ) { return null }

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


export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
  clickOnFocus: true,
} )( Navigator )
