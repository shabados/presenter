import React from 'react'
import { arrayOf, shape, string, func, number } from 'prop-types'

import { List, ListItem } from '@material-ui/core'

import { LINE_HOTKEYS } from '../lib/consts'
import controller from '../lib/controller'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import './Bookmarks.css'

const Bookmarks = ( { banis, register, focused } ) => (
  <List className="bookmarks">
    {banis.map( ( { id, nameGurmukhi }, index ) => (
      <ListItem
        className={focused === index ? 'focused' : ''}
        key={id}
        ref={ref => register( index, ref )}
        onClick={() => controller.bani( id )}
      >
        <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
        <span className="gurmukhi text">{nameGurmukhi}</span>
      </ListItem>
    ) )}
  </List>
)

Bookmarks.propTypes = {
  banis: arrayOf( shape( {
    id: string,
    name: string,
  } ) ).isRequired,
  register: func.isRequired,
  focused: number.isRequired,
}

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
} )( Bookmarks )
