import React from 'react'

import { List, ListItem } from 'material-ui'

import { LINE_HOTKEYS } from '../../lib/consts'
import { stripPauses } from '../../lib/utils'
import controller from '../../lib/controller'

import withNavigationHotKeys from '../withNavigationHotKeys'

import './History.css'

const History = ( { history, location, shabadHistory, register, focused } ) => (
  <List className="history">
    {shabadHistory.map( ( { timestamp, line: { id: lineId, shabadId, gurmukhi } }, index ) => (
      <ListItem
        className={focused === index ? 'gurmukhi focused' : 'gurmukhi'}
        key={timestamp}
        ref={ref => register( index, ref )}
        onClick={() => controller.shabad( { lineId, shabadId } )}
      >
        <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
        <span className="text">{stripPauses( gurmukhi )}</span>
      </ListItem>
        ) ) }
  </List>
)

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
} )( History )
