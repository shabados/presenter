import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { List, ListItem } from 'material-ui'

import { NAVIGATOR_URL } from '../../lib/consts'
import { stripPauses } from '../../lib/utils'
import controller from '../../lib/controller'

import './Controller.css'
import withNavigationHotKeys from '../withNavigationHotKeys'

/**
 * Controller Component.
 * Displays lines from Shabad and allows navigation.
 */
class Controller extends Component {
  componentDidMount() {
    const { updateFocus, lineId } = this.props

    // Set the focus to the active line
    updateFocus( lineId )
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
   * @param index The index of the light
   */
  Line = ( { gurmukhi, id } ) => {
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
        {stripPauses( gurmukhi )}
      </ListItem>
    )
  }

  render() {
    const { shabad } = this.props

    // If there's no Shabad to show, go back to the Navigator
    if ( !shabad ) {
      return <Redirect to={NAVIGATOR_URL} />
    }

    const { lines } = shabad
    return (
      <List className="controller">
        {shabad ? lines.map( this.Line ) : null}
      </List>
    )
  }
}

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
  clickOnFocus: true,
} )( Controller )
