import React, { Children, cloneElement, Component } from 'react'
import { findDOMNode } from 'react-dom'

import HotKeys from 'react-hotkeys'

class HotKeysWrapper extends Component {
  constructor( props ) {
    super( props )

    this.childrenRefs = []
  }

  pushRef = ref => this.childrenRefs = [ ...this.childrenRefs, ref ]

  render() {
    const { children } = this.props

    return Children.map( children, child => cloneElement( child, { ref: this.pushRef } ) )
  }

  componentDidMount() {
    if ( this.childrenRefs.length ) {
      console.log( findDOMNode( this.childrenRefs[ 0 ] ).focus() )


    }
  }
}

export default HotKeysWrapper
