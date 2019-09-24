import React from 'react'
import { func, number, arrayOf, shape, instanceOf, string } from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faDownload,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'


import { LINE_HOTKEYS, HISTORY_DOWNLOAD_URL } from '../lib/consts'
import { stripPauses } from '../lib/utils'
import controller from '../lib/controller'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import './History.css'

const History = ( { transitionHistory, register, focused } ) => (
  <List className="history">
    {transitionHistory.map( ( { timestamp, line: { id: lineId, shabadId, gurmukhi } }, index ) => (
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
    <ListItem onClick={() => transitionHistory.length && window.open( HISTORY_DOWNLOAD_URL )}>
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

History.propTypes = {
  register: func.isRequired,
  focused: number.isRequired,
  transitionHistory: arrayOf( shape( {
    timestamp: instanceOf( Date ),
    line: shape( {
      id: string,
      shabadId: string,
      gurmukhi: string,
    } ),
  } ) ),
}

History.defaultProps = {
  transitionHistory: [],
}

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
} )( History )
