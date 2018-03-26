import React, { Component } from 'react'

import controller from '../lib/controller'

import './Display.css'

class Display extends Component {
  constructor( props ) {
    super( props )

    this.state = {}
  }

  componentDidMount() {
    controller.on( 'shabad', this.onShabad )
  }

  componentWillUnmount() {
    controller.off( 'shabad', this.onShabad )
  }

  onShabad = data => {
    console.log( data )
  }

  render() {
    return (
      <p>display</p>
    )
  }
}

export default Display
