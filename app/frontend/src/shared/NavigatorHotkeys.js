import React, { Component } from 'react'
import { arrayOf, shape, string, node, bool, objectOf } from 'prop-types'
import { GlobalHotKeys } from 'react-hotkeys'

import controller from '../lib/controller'
import { NAVIGATOR_SHORTCUTS } from '../lib/keyMap'

/**
 * Hotkeys for controlling the navigator.
 */
class NavigatorHotKeys extends Component {
  goPreviousLine = () => {
    const { shabad, bani, lineId } = this.props
    const { lines } = shabad || bani || {}

    if ( !lines ) return

    const { orderId } = lines.find( ( { id } ) => id === lineId ) || {}

    controller.previousLine( orderId )
  }

  goFirstLine = () => {
    const { lineId, shabad, bani } = this.props
    const { lines } = shabad || bani || {}

    if ( !lines ) return

    const [ firstLine ] = lines

    // Go to the previous shabad if the first line is highlighted (but not for banis)
    if ( !bani && lineId === firstLine.id ) controller.previousShabad( shabad.orderId )
    else controller.line( firstLine.id )
  }

  goLastLine = () => {
    const { lineId, shabad, bani } = this.props
    const { lines } = shabad || bani || {}

    if ( !lines ) return

    const lastLine = lines[ lines.length - 1 ]

    // Go to the next shabad if the last line is highlighted (but not for banis)
    if ( !bani && lineId === lastLine.id ) controller.nextShabad( shabad.orderId )
    else controller.line( lastLine.id )
  }

  autoToggle = () => {
    const { shabad } = this.props

    //* Only for Shabads
    if ( shabad ) controller.autoToggleShabad( this.props )
  }

  restoreLine = () => {
    const { lineId, viewedLines } = this.props

    const ids = Object
      .entries( viewedLines )
      .sort( ( [ , t1 ], [ , t2 ] ) => new Date( t1 ) - new Date( t2 ) )
      .map( ( [ id ] ) => id )

    if ( lineId || !ids ) return

    controller.line( ids[ ids.length - 1 ] )
  }

  setMainLine = () => {
    const { lineId } = this.props

    if ( lineId ) controller.mainLine( lineId )
  }

  goMainLine = () => {
    const { mainLineId } = this.props

    if ( mainLineId ) controller.line( mainLineId )
  }

  goJumpLine = () => {
    const { nextLineId } = this.props

    if ( nextLineId ) controller.line( nextLineId )
  }

  goNextLine = () => {
    const { shabad, bani, lineId } = this.props
    const { lines } = shabad || bani || {}

    if ( !lines ) return

    const { orderId } = lines.find( ( { id } ) => id === lineId ) || {}

    controller.nextLine( orderId )
  }

  /**
   * Prevents the default action from occurring for each handler.
   * @param events An object containing the event names and corresponding handlers.
   */
  preventDefault = events => Object.entries( events )
    .reduce( ( events, [ name, handler ] ) => ( {
      ...events,
      [ name ]: event => event.preventDefault() || handler( event ),
    } ), {} )

    // Navigation Hotkey Handlers
    hotKeyHandlers = this.preventDefault( {
      [ NAVIGATOR_SHORTCUTS.previousLine.name ]: this.goPreviousLine,
      [ NAVIGATOR_SHORTCUTS.nextLine.name ]: this.goNextLine,
      [ NAVIGATOR_SHORTCUTS.firstLine.name ]: this.goFirstLine,
      [ NAVIGATOR_SHORTCUTS.lastLine.name ]: this.goLastLine,
      [ NAVIGATOR_SHORTCUTS.autoToggle.name ]: this.autoToggle,
      [ NAVIGATOR_SHORTCUTS.restoreLine.name ]: this.restoreLine,
      [ NAVIGATOR_SHORTCUTS.setMainLine.name ]: this.setMainLine,
      [ NAVIGATOR_SHORTCUTS.goJumpLine.name ]: this.goJumpLine,
      [ NAVIGATOR_SHORTCUTS.goMainLine.name ]: this.goMainLine,
    } )

    render() {
      const { active, children, settings } = this.props
      const { local: { hotkeys } } = settings || {}

      return (
        <GlobalHotKeys keyMap={hotkeys} handlers={active && this.hotKeyHandlers}>
          {children}
        </GlobalHotKeys>
      )
    }
}


NavigatorHotKeys.propTypes = {
  active: bool,
  children: node,
  lineId: string,
  nextLineId: string,
  mainLineId: string,
  shabad: shape( {
    lines: arrayOf( shape( { id: string } ) ),
  } ),
  bani: shape( {
    lines: arrayOf( shape( { id: string } ) ),
  } ),
  viewedLines: arrayOf( string ),
  settings: shape( { local: shape( { hotkeys: objectOf( arrayOf( string ) ) } ) } ).isRequired,
}

NavigatorHotKeys.defaultProps = {
  active: false,
  shabad: null,
  bani: null,
  lineId: null,
  nextLineId: null,
  mainLineId: null,
  viewedLines: [],
  children: null,
}

export default NavigatorHotKeys
