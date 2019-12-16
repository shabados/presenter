import React from 'react'
import { func, number, arrayOf, shape, instanceOf, string, objectOf, oneOfType } from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faDownload,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

import { LINE_HOTKEYS } from '../lib/keyMap'
import { HISTORY_DOWNLOAD_URL } from '../lib/consts'
import { stripPauses } from '../lib/utils'
import controller from '../lib/controller'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import './History.css'

const History = ( { transitionHistory, latestLines, register, focused } ) => (
  <List className="history">
    {transitionHistory.map( ( {
      timestamp,
      line: { id: lineId, shabadId, gurmukhi },
      bani,
    }, index ) => {
      const { line: latestLine } = latestLines[ timestamp ] || {}

      // Use timestamp to get latest line for that navigation period
      const latestLineId = latestLine ? latestLine.id : lineId

      const onClick = () => ( bani
        ? controller.bani( { baniId: bani.id, lineId: latestLineId } )
        : controller.shabad( { shabadId, lineId: latestLineId } ) )

      return (
        <ListItem
          className={focused === index ? 'focused' : ''}
          key={timestamp}
          ref={ref => register( index, ref )}
          onClick={onClick}
        >
          <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
          <span className="gurmukhi text">{bani ? bani.nameGurmukhi : stripPauses( gurmukhi )}</span>
          <span className="timestamp meta">
            {new Date( timestamp ).toLocaleTimeString( navigator.language, { hour: '2-digit', minute: '2-digit' } )}
          </span>
        </ListItem>
      )
    } ) }
    <ListItem onClick={() => transitionHistory.length && window.open( HISTORY_DOWNLOAD_URL )}>
      <ListItemIcon className="meta icon">
        <FontAwesomeIcon icon={faDownload} />
      </ListItemIcon>
      Export
    </ListItem>
    <ListItem onClick={controller.clearHistory}>
      <ListItemIcon className="meta icon">
        <FontAwesomeIcon icon={faTrash} />
      </ListItemIcon>
      Clear History
    </ListItem>
  </List>
)

const lineHistoryType = shape( {
  timestamp: oneOfType( [ instanceOf( Date ), string ] ),
  line: shape( {
    id: string,
    shabadId: string,
    gurmukhi: string,
  } ),
  bani: shape( { nameGurmukhi: string } ),
} )

History.propTypes = {
  register: func.isRequired,
  focused: number,
  transitionHistory: arrayOf( lineHistoryType ),
  latestLines: objectOf( lineHistoryType ),
}

History.defaultProps = {
  focused: 0,
  transitionHistory: [],
  latestLines: {},
}

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
} )( History )
