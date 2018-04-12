import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { List, ListItem } from 'material-ui'
import {
  faChevronUp,
  faChevronDown,
  faThumbtack,
  faExchangeAlt,
} from '@fortawesome/fontawesome-free-solid'

import { CONTROLLER_URL, LINE_HOTKEYS } from '../../lib/consts'
import { stripPauses } from '../../lib/utils'
import controller from '../../lib/controller'

import withNavigationHotKeys from '../withNavigationHotKeys'

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
    const className = activeLine ? 'current line' : 'line'

    // Register the reference to the line with the NavigationHotKey HOC
    const ref = line => register( id, line )

    // Move to the line id on click
    const onClick = () => controller.line( id )

    return (
      <ListItem key={id} className={className} onClick={onClick} ref={ref} tabIndex={0}>
        <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
        <span className="text">{stripPauses( gurmukhi )}</span>
      </ListItem>
    )
  }

  /**
   * Used by Menu parent to render content in the bottom bar.
   * @param ToolbarButton A toolbar button for rendering a hoverable and clickable button.
   */
  renderBarContent = ( ToolbarButton ) => {
    const { mainLineId, lineId } = this.props

    console.log( mainLineId )
    const autoselectProps = {
      icon: faExchangeAlt,
      onClick: () => controller.mainLine( lineId ),
    }

    return (
      <div className="navigator-controls">
        <ToolbarButton icon={faChevronUp}>Up</ToolbarButton>
        1/16
        <ToolbarButton icon={faChevronDown}>Down</ToolbarButton>
        <ToolbarButton className="autoselect" {...autoselectProps}>Autoselect</ToolbarButton>
      </div>
    )
  }

  render() {
    const { location, shabad } = this.props

    // If there's no Shabad to show, go back to the controller
    if ( !shabad ) {
      return <Redirect to={{ ...location, pathname: CONTROLLER_URL }} />
    }

    const { lines } = shabad
    return (
      <List className="navigator">
        {shabad && lines.map( this.Line )}
      </List>
    )
  }
}

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
  clickOnFocus: true,
} )( Navigator )
