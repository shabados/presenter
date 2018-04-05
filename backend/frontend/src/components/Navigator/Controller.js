import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { findDOMNode } from 'react-dom'
import scrollIntoView from 'scroll-into-view'

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
    // Scroll to active line if it's been rendered
    if ( this.activeLine ) {
      this.scrollLineIntoCenter( this.activeLine )
    }
  }

  componentDidUpdate() {
    // Scroll any line updates into the centre
    this.scrollLineIntoCenter( this.activeLine )
  }

  /**
   * Scrolls the line into the middle of the controller, given a reference.
   * @param ref The reference to the line to scroll into the center.
   */
  scrollLineIntoCenter = ref => scrollIntoView( findDOMNode( ref ), ( { time: 200 } ) )

  /**
   * Line component that attaches click handlers.
   * @param gurmukhi The Gurmukhi for the line to render.
   * @param id The id of the line.
   * @param index The index of the light
   */
  Line = ( { gurmukhi, id }, index ) => {
    const { lineId, register } = this.props

    // Check if the line being rendered is the currently displayed line
    const activeLine = id === lineId

    // Set the class name appropriately for the active line
    const className = activeLine ? 'current line' : 'line'

    // Store a reference to the DOM element of the active line so it can be scrolled to after render
    const ref = line => {
      if ( activeLine ) {
        this.activeLine = line
      }

      register( index, line )
    }

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
  arrowKeys: false,
  lineKeys: true,
  clickOnNavigate: true,
} )( Controller )
