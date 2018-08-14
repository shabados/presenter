import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import { HotKeys } from 'react-hotkeys'

import { scrollIntoCenter } from '../lib/utils'
import { LINE_HOTKEYS } from '../lib/consts'

/**
 * HOC to automatically add navigational key bindings to child elements.
 * @param arrowKeys Navigate with arrow keys to the next and previous DOM elements.
 * @param lineKeys Enable line jumping via hotkeys.
 * @param clickOnFocus Simulate a click on the item that is newly focused.
 */
const withNavigationHotKeys = ( { arrowKeys = true, lineKeys, clickOnFocus } ) =>
  WrappedComponent => {
    class WithNavigationHotKeys extends Component {
      constructor( props ) {
        super( props )

        this.state = { focusedIndex: 0 }

        // Stores the ref to the parent containing the children
        this.nodes = new Map()

        // Stores any input types, so that their keydown can be overriden
        this.inputs = []
      }

      componentDidMount() {
        this.setNodeSize()
        this.setFocus()

        // Add event listeners to inputs
        this.inputs.forEach( input => input.addEventListener( 'keydown', this.onKeyDown ) )
      }

      componentDidUpdate() {
        this.setNodeSize()
        this.setFocus()
      }

      componentWillUnmount() {
        // Remove event listeners from inputs
        this.inputs.forEach( input => input.removeEventListener( 'keydown', this.onKeyDown ) )
      }

      /**
       * Defocuses an input on keydown, when up or down is pressed.
       * @param event The keydown event.
       */
      onKeyDown = event => {
        const { key } = event

        if ( key === 'ArrowDown' || key === 'ArrowUp' ) {
          event.preventDefault()
          this.setNodeSize()
          if ( key === 'ArrowDown' ) { this.nextItem() } else { this.prevItem() }
          event.target.blur()
        }
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
        const node = findDOMNode( [ ...this.nodes.values() ][ focusedIndex ] )
        if ( node ) {
          node.focus()
          scrollIntoCenter( node )
        }
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
       * Jump to an item given it's name/identifier.
       * @param name The name of the element.
       * @param click Trigger the click.
       */
      jumpToName = ( name, click = true ) =>
        this.jumpTo( [ ...this.nodes.keys() ].findIndex( key => key === name ), click )

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
       * Focuses the previous item in the list of elements.
       */
      prevItem = () => {
        const { focusedIndex: prevIndex } = this.state

        // Set the previous focus, with wrap-around
        const focusedIndex = prevIndex > 0 ? prevIndex - 1 : this.nodes.size - 1

        this.jumpTo( focusedIndex )
      }

      /**
       * Focuses the next item in the list of elements.
       */
      nextItem = () => {
        const { focusedIndex: prevIndex } = this.state

        // Set the next focus, with wrap-around
        const focusedIndex = prevIndex < this.nodes.size - 1 ? prevIndex + 1 : 0

        this.jumpTo( focusedIndex )
      }

      /**
       * Registers the ref under the current list of nodes.
       * @param name The name to identify the ref.
       * @param ref The ref to store.
       * @param isInput Whether or not the ref is to an `<input/>`.
       */
      registerRef = ( name, ref, isInput ) => {
        this.nodes.set( name, ref )

        // Store the input, if it is one
        if ( isInput ) {
          this.inputs = [ ...this.inputs, ref ]
        }
      }

      /**
       * Generates handlers for each of the nodes, using the keys from LINE HOTKEYS to jump to them.
       */
      generateLineHandlers = () => LINE_HOTKEYS
        .slice( 0, this.nodes.size )
        .reduce( ( handlers, key, i ) => ( {
          ...handlers,
          [ key ]: () => this.jumpTo( i ),
        } ), {} )


      keymap = {
        next: [ 'down', 'right', 'tab' ],
        previous: [ 'up', 'left', 'shift+tab' ],
        enter: [ 'enter', 'return', 'space' ],
        first: [ 'home' ],
        last: [ 'end' ],
      }

      arrowHandlers = {
        first: () => this.jumpTo( 0 ),
        last: () => this.jumpTo( this.nodes.size - 1 ),
        previous: this.prevItem,
        next: this.nextItem,
        enter: this.simulateClick,
      }

      render() {
        const { forwardedRef, ...rest } = this.props
        const { focusedIndex } = this.state

        const handlers = {
          ...( arrowKeys ? this.arrowHandlers : {} ),
          ...( lineKeys ? this.generateLineHandlers() : {} ),
        }

        // Get the name of the currently focused element
        const focused = [ ...this.nodes.keys() ][ focusedIndex ]

        return (
          <HotKeys
            component="document-fragment"
            focused
            attach={window}
            handlers={handlers}
            keyMap={this.keymap}
          >
            <WrappedComponent
              {...rest}
              ref={forwardedRef}
              register={this.registerRef}
              updateFocus={this.jumpToName}
              focused={focused}
            />
          </HotKeys>
        )
      }
    }

    const forwardRef = ( props, ref ) => <WithNavigationHotKeys {...props} forwardedRef={ref} />
    return React.forwardRef( forwardRef )
  }


export default withNavigationHotKeys
