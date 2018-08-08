import React from 'react'

import { List, ListItem, ListItemIcon } from 'material-ui'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  faDownload,
  faTasks,
  faTrash,
} from '@fortawesome/fontawesome-free-solid'


import { LINE_HOTKEYS } from '../../lib/consts'
import { stripPauses } from '../../lib/utils'
import controller from '../../lib/controller'

import withNavigationHotKeys from '../withNavigationHotKeys'

import './History.css'

const History = ( { history, location, shabadHistory, register, focused } ) => (
  <List className="history">
    {shabadHistory.map( ( { timestamp, line: { id: lineId, shabadId, gurmukhi } }, index ) => (
      <ListItem
        className={focused === index ? 'focused' : ''}
        key={timestamp}
        ref={ref => register( index, ref )}
        onClick={() => controller.shabad( { lineId, shabadId } )}
      >
        <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
        <span className="gurmukhi text">{stripPauses( gurmukhi )}</span>
      </ListItem>
    ) )}
    <ListItem onClick={controller.export}>
      <ListItemIcon className="meta">
        <FontAwesomeIcon icon={faDownload} />
      </ListItemIcon>
      Export
    </ListItem>
    <ListItem onClick={controller.exportAll}>
      <ListItemIcon className="meta">
        <FontAwesomeIcon icon={faTasks} />
      </ListItemIcon>
      Export (All Lines)
    </ListItem>
    <ListItem onClick={controller.clearHistory}>
      <ListItemIcon className="meta">
        <FontAwesomeIcon icon={faTrash} />
      </ListItemIcon>
      Clear History
    </ListItem>
  </List>
)

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
} )( History )
