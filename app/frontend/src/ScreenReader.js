import React, { Component } from 'react'

import './ScreenReader.css'

class ScreenReader extends Component {
  render() {
    const { shabad, bani } = this.props

    if ( !shabad && !bani ) { return null }

    return shabad.lines.map( ( { gurmukhi, id } ) => <p key={id}>{gurmukhi}</p> )
  }
}

export default ScreenReader
