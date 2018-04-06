import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import { HotKeys } from 'react-hotkeys'

import { scrollIntoCenter } from '../lib/utils'

/**
 * HOC to automatically add navigational key bindings to child elements.
 */
const withNavigationHotKeys = WrappedComponent =>
  class WithNavigationHotKeys extends Component {
    constructor( props ) {
      super( props )

      this.state = { focusedIndex: 0 }

      // Stores the ref to the parent containing the children
      this.nodes = new Map()
    }

    /**
     * Registers the ref under the current list of nodes.
     * @param name The name to identify the ref.
     * @param ref The ref to store.
     */
    registerRef = ( name, ref ) => this.nodes.set( name, ref )

    /**
     * Focuses the previous item in the list of elements.
     */
    prevItem = () => {
      const { focusedIndex: prevIndex } = this.state

      // Set the previous focus, with wrap-around
      const focusedIndex = prevIndex > 0 ? prevIndex - 1 : this.nodes.size - 1

      this.setState( { focusedIndex } )
    }

    /**
     * Focuses the next item in the list of elements.
     */
    nextItem = () => {
      const { focusedIndex: prevIndex } = this.state

      // Set the next focus, with wrap-around
      const focusedIndex = prevIndex < this.nodes.size - 1 ? prevIndex + 1 : 0

      this.setState( { focusedIndex } )
    }

    /**
     * Simulates a click on the focused component.
     */
    simulateClick = () => {
      const { focusedIndex } = this.state

      // Simulate a click on the focused element if possible
      const node = findDOMNode( [ ...this.nodes.values() ][ focusedIndex ] )
      if ( node ) {
        node.click()
      }
    }

    /**
     * Sets the focus in the DOM to the `focusedIndex`'th element of the children.
     */
    setFocus = () => {
      const { focusedIndex } = this.state

      // Find the DOM node for the child to focus, and focus it
      const node = findDOMNode( [ ...this.nodes.values() ][ focusedIndex ] )
      if ( node ) {
        node.focus()
        scrollIntoCenter( node )
      }
    }

    componentDidMount() {
      this.setFocus()
    }

    componentDidUpdate() {
      this.setFocus()
    }

    keymap = {
      next: [ 'down', 'right', 'tab' ],
      previous: [ 'up', 'left', 'shift+tab' ],
      enter: [ 'enter', 'return', 'space' ],
    }

    render() {
      const { focusedIndex } = this.state

      const arrowHandlers = {
        previous: this.prevItem,
        next: this.nextItem,
        enter: this.simulateClick,
      }

      // Get the name of the currently focused element
      const focused = [ ...this.nodes.keys() ][ focusedIndex ]

      return (
        <HotKeys component="document-fragment"
                 focused
                 attach={window}
                 handlers={arrowHandlers}
                 keyMap={this.keymap}
        >
          <WrappedComponent {...this.props} register={this.registerRef} focused={focused} />
        </HotKeys>
      )
    }
  }


export default withNavigationHotKeys
