import React from 'react'

import { List, ListItem } from '@material-ui/core'

import { LINE_HOTKEYS } from '../lib/consts'
import controller from '../lib/controller'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import './Banis.css'

const Banis = ( { banis, register, focused } ) => (
  <List className="banis">
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

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
} )( Banis )
