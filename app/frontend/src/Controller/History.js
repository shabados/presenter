import React from 'react'

import { List, ListItem, ListItemIcon } from 'material-ui'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  faDownload,
  faTrash,
} from '@fortawesome/fontawesome-free-solid'


import { LINE_HOTKEYS, HISTORY_DOWNLOAD_URL } from '../lib/consts'
import { stripPauses } from '../lib/utils'
import controller from '../lib/controller'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

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
    <ListItem onClick={() => ( shabadHistory.length ? window.open( HISTORY_DOWNLOAD_URL ) : null )}>
      <ListItemIcon className="meta">
        <FontAwesomeIcon icon={faDownload} />
      </ListItemIcon>
      Export
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
