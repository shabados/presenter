import React from 'react'
import { arrayOf, shape, string, func, number, oneOfType } from 'prop-types'

import { List, ListItem } from '@material-ui/core'

import { LINE_HOTKEYS } from '../lib/keyMap'
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
        onClick={() => controller.bani( { baniId: id } )}
      >
        <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
        <span className="gurmukhi text">{nameGurmukhi}</span>
      </ListItem>
    ) )}
  </List>
)

Bookmarks.propTypes = {
  banis: arrayOf( shape( {
    id: oneOfType( [ string, number ] ),
    name: string,
  } ) ).isRequired,
  register: func.isRequired,
  focused: number,
}

Bookmarks.defaultProps = {
  focused: 0,
}

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
} )( Bookmarks )
