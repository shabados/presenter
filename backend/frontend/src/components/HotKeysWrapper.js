import React, { Children, cloneElement, Component } from 'react'
import { findDOMNode } from 'react-dom'

import { HotKeys } from 'react-hotkeys'

import { scrollIntoCenter } from '../lib/utils'

/**
 * HOC to automatically add navigational key bindings to child elements.
 * Not the cleanest :|
 */
class HotKeysWrapper extends Component {
  constructor( props ) {
    super( props )

    this.state = { focusedIndex: 0 }

    // Stores the ref to the parent containing the children
    this.nodes = []
  }

  /**
   * Pushes the ref to the current list of nodes.
   * @param ref The ref to store.
   */
  pushRef = ref => this.nodes = [ ...this.nodes, ref ]

  /**
   * Focuses the previous item in the list of elements.
   */
  prevItem = () => {
    const { children } = this.props
    const { focusedIndex: prevIndex } = this.state

    // Set the next focus, with wrap-around
    const focusedIndex = prevIndex > 0 ? prevIndex - 1 : children.length - 1

    this.setState( { focusedIndex } )
  }

  /**
   * Focuses the next item in the list of elements.
   */
  nextItem = () => {
    const { children } = this.props
    const { focusedIndex: prevIndex } = this.state

    // Set the next focus, with wrap-around
    const focusedIndex = prevIndex < children.length - 1 ? prevIndex + 1 : 0

    this.setState( { focusedIndex } )
  }

  /**
   * Simulates a click on the focused component.
   */
  simulateClick = () => {
    const { focusedIndex } = this.state
    const { children } = this.props

    // Simulate a click on the focused element if possible
    if ( children.length && children.length === this.nodes.length ) {
      findDOMNode( this.nodes[ focusedIndex ] ).click()
    }
  }

  /**
   * Sets the focus in the DOM to the `focusedIndex`'th element of the children.
   */
  setFocus = () => {
    const { children } = this.props
    const { focusedIndex } = this.state

    // Find the DOM node for the child to focus, and focus it
    if ( children.length && children.length === this.nodes.length ) {
      const node = findDOMNode( this.nodes[ focusedIndex ] )
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
    const { children } = this.props
    const { focusedIndex } = this.state

    const arrowHandlers = {
      previous: this.prevItem,
      next: this.nextItem,
      enter: this.simulateClick,
    }

    // FIXME: The children component classes are being modified here! Use render props? :(
    // FIXME: using document-fragment because fragment causes prop error because of tabIndex=-1. PR waiting to fix this.
    return (
      <HotKeys component="document-fragment"
               focused
               attach={window}
               handlers={arrowHandlers}
               keyMap={this.keymap}
      >
        {Children.map( children, ( child, i ) => cloneElement( child, {
          ref: this.pushRef,
          className: focusedIndex === i
            ? `${child.props.className || ''} focused`
            : child.props.className || '',
        } ) )}
      </HotKeys>
    )
  }
}

export default HotKeysWrapper
