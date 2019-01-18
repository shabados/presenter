import React from 'react'
import { arrayOf, shape, string, func, number } from 'prop-types'

import { List, ListItem } from '@material-ui/core'

import { LINE_HOTKEYS } from '../lib/consts'
import controller from '../lib/controller'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import './Banis.css'

const Banis = ( { banis, register, focused } ) => (
  <List className="banis">
    {banis.map( ( { id, name }, index ) => (
      <ListItem
        className={focused === index ? 'focused' : ''}
        key={id}
        ref={ref => register( index, ref )}
        onClick={() => controller.bani( id )}
      >
        <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
        <span className="gurmukhi text">{name}</span>
      </ListItem>
    ) )}
  </List>
)

Banis.propTypes = {
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
} )( Banis )
