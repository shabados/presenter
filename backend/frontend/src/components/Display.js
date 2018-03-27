import React, { Component } from 'react'

import controller from '../lib/controller'

import Line from './Line'

import './Display.css'

/**
 * Display Component.
 * Displays the current Shabad, with visual settings.
 */
class Display extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      shabad: null,
      lineId: null,
    }
  }

  componentDidMount() {
    controller.on( 'shabad', this.onShabad )
    controller.on( 'line', this.onLine )
  }

  componentWillUnmount() {
    controller.off( 'shabad', this.onShabad )
    controller.off( 'line', this.onLine )
  }

  onShabad = shabad => this.setState( { shabad } )

  onLine = lineId => this.setState( { lineId } )

  render() {
    const { shabad, lineId } = this.state

    // Do not render anything if there's no shabad or line
    if ( !shabad || !lineId ) {
      return null
    }

    // Find the correct line in the shabad
    const line = shabad.lines.find( ( { id } ) => lineId === id )

    return (
      <div className="display">
        {line ? <Line {...line} /> : null}
      </div>
    )
  }
}

export default Display
