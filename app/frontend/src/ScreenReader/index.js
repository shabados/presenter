import React, { Component } from 'react'
import { shape, arrayOf, string } from 'prop-types'
import { hot } from 'react-hot-loader/root'

import './index.css'

class ScreenReader extends Component {
  render() {
    const { shabad, bani } = this.props

    if ( !shabad && !bani ) return null

    return shabad.lines.map( ( { gurmukhi, id } ) => <p key={id}>{gurmukhi}</p> )
  }
}

ScreenReader.propTypes = {
  shabad: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
  bani: shape( { lines: arrayOf( shape( { id: string, gurmukhi: string } ) ) } ),
}

ScreenReader.defaultProps = {
  shabad: undefined,
  bani: undefined,
}

export default hot( ScreenReader )
