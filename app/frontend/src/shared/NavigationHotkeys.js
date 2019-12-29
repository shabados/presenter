import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { instanceOf } from 'prop-types'

import { GlobalHotKeys } from 'react-hotkeys'

import { scrollIntoCenter, debounceHotKey, mapPlatformKeys } from '../lib/utils'
import { LINE_HOTKEYS } from '../lib/keyMap'

const isInput = element => element instanceof HTMLElement && element.tagName.toLowerCase() === 'input'

const preventDefault = fn => event => {
  event.preventDefault()
  fn( event )
}

/**
 * HOC to automatically add navigational key bindings to child elements.
 * @param {boolean} arrowKeys Navigate with arrow keys to the next and previous DOM elements.
 * @param {boolean} lineKeys Enable line jumping via hotkeys.
 * @param {boolean} clickOnFocus Simulate a click on the item that is newly focused.
 * @param {Object} keymap Keymap to combine with existing keymap.
 * @returns {Component} The decorated component.
 */
export const withNavigationHotkeys = ( {
  arrowKeys = true,
  lineKeys,
  clickOnFocus,
  keymap,
  wrapAround = true,
} ) => WrappedComponent => {
  class NavigationHotkeys extends Component {
    constructor( props ) {
      super( props )

      this.state = { focusedIndex: 0 }

      // Stores the ref to the parent containing the children
      this.nodes = new Map()

      // Generate the handlers in advance
      this.handlers = {
        ...( arrowKeys && this.arrowHandlers ),
        ...( lineKeys && this.lineHandlers ),
      }
    }

    componentDidMount() {
      this.setNodeSize()
      this.setFocus()
    }

    componentDidUpdate( _, { focusedIndex: prevFocusedIndex } ) {
      const { focusedIndex } = this.state

      if ( prevFocusedIndex === focusedIndex ) return

      this.setNodeSize()
      this.setFocus()
    }

      /**
       * Sets the length of the nodes to the correct size.
       */
      setNodeSize = () => this.nodes.forEach( ( value, key ) => ( (
        value || this.nodes.delete( key ) )
      ) )

      /**
       * Sets the focus in the DOM to the `focusedIndex`'th element of the children.
       */
      setFocus = () => {
        const { focusedIndex } = this.state

        // Find the DOM node for the child to focus, and focus it
        // eslint-disable-next-line react/no-find-dom-node
        const node = findDOMNode( [ ...this.nodes.values() ][ focusedIndex ] )
        if ( node ) scrollIntoCenter( node )
      }

      /**
       * Simulates a click on the focused component.
       */
      simulateClick = debounceHotKey( () => {
        const { focusedIndex } = this.state

        // Simulate a click on the focused element if possible
        // eslint-disable-next-line react/no-find-dom-node
        const node = findDOMNode( [ ...this.nodes.values() ][ focusedIndex ] )
        if ( node ) {
          node.click()
        }
      } )

      /**
       * Jump to an item given it's name/identifier.
       * @param name The name of the element.
       * @param click Trigger the click.
       */
      jumpToName = ( name, click = true ) => this.jumpTo(
        [ ...this.nodes.keys() ].findIndex( key => key === name ),
        click,
      )

      /**
       * Jumps to an element.
       * @param focusedIndex The element index to jump to.
       * @param click Trigger the click.
       */
      jumpTo = ( focusedIndex, click = true ) => {
        this.setState( { focusedIndex } )

        // Click on navigation if set
        if ( clickOnFocus && click ) {
          this.simulateClick()
        }
      }

      /**
       * Jumps to the first element, excluding inputs.
       */
      jumpToFirst = () => {
        const index = [ ...this.nodes.values() ].findIndex( element => !isInput( element ) )

        this.jumpTo( index )
      }

      /**
       * Focuses the previous item in the list of elements.
       */
      prevItem = () => {
        const { focusedIndex: prevIndex } = this.state

        if ( !wrapAround && prevIndex === 0 ) return

        // Set the previous focus, with wrap-around
        const focusedIndex = prevIndex > 0 ? prevIndex - 1 : this.nodes.size - 1

        this.jumpTo( focusedIndex )
      }

      /**
       * Focuses the next item in the list of elements.
       */
      nextItem = () => {
        const { focusedIndex: prevIndex } = this.state

        if ( !wrapAround && prevIndex === this.nodes.size - 1 ) return

        // Set the next focus, with wrap-around
        const focusedIndex = prevIndex < this.nodes.size - 1 ? prevIndex + 1 : 0

        this.jumpTo( focusedIndex )
      }

      /**
       * Registers the ref under the current list of nodes.
       * @param name The name to identify the ref.
       * @param ref The ref to store.
       */
      registerRef = ( name, ref ) => this.nodes.set( name, ref )

      /**
       * Generates handlers for each of the nodes, using the keys from LINE HOTKEYS to jump to them.
       */
      lineHandlers = LINE_HOTKEYS.reduce( ( handlers, key, i ) => ( {
        ...handlers,
        [ key ]: () => this.jumpTo( i ),
      } ), {} )

      arrowHandlers = {
        first: preventDefault( this.jumpToFirst ),
        last: preventDefault( () => this.jumpTo( this.nodes.size - 1 ) ),
        previous: preventDefault( this.prevItem ),
        next: preventDefault( this.nextItem ),
        enter: this.simulateClick,
      }

      keymap = mapPlatformKeys( {
        next: [ 'down', 'right', 'tab', 'PageDown', 'l' ],
        previous: [ 'up', 'left', 'shift+tab', 'PageUp', 'j' ],
        ...( !clickOnFocus && { enter: [ 'enter', 'return' ] } ),
        first: [ 'home', 'ctrl+up' ],
        last: [ 'end', 'ctrl+down' ],
        ...( lineKeys && LINE_HOTKEYS.reduce( ( keymap, hotkey ) => ( {
          ...keymap,
          [ hotkey ]: [ hotkey ],
        } ), {} ) ),
        ...keymap,
      } )

      render() {
        const { forwardedRef, ...rest } = this.props
        const { focusedIndex } = this.state

        // Get the name of the currently focused element
        const focused = [ ...this.nodes.keys() ][ focusedIndex ]

        return (
          <GlobalHotKeys handlers={this.handlers} keyMap={this.keymap}>
            <WrappedComponent
              {...rest}
              ref={forwardedRef}
              register={this.registerRef}
              updateFocus={this.jumpToName}
              focused={focused}
            />
          </GlobalHotKeys>
        )
      }
  }

  NavigationHotkeys.propTypes = {
    forwardedRef: instanceOf( NavigationHotkeys ),
  }

  NavigationHotkeys.defaultProps = {
    forwardedRef: null,
  }

  const forwardRef = ( props, ref ) => <NavigationHotkeys {...props} forwardedRef={ref} />
  return React.forwardRef( forwardRef )
}
