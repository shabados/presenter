import React, { Component } from 'react'

import controller from '../lib/controller'

import './Display.css'

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

    return (
      <p>{shabad ? JSON.stringify( shabad.lines.find( ( { id } ) => lineId === id ) ) : null}</p>
    )
  }
}

export default Display
