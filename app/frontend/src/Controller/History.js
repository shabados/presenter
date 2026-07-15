import React, { useMemo, useContext } from 'react'
import { func, number } from 'prop-types'
import { stripVishraams } from 'gurmukhi-utils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faDownload,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

import { LINE_HOTKEYS } from '../lib/keyMap'
import { HISTORY_DOWNLOAD_URL } from '../lib/consts'
import controller from '../lib/controller'
import { HistoryContext } from '../lib/contexts'

import { withNavigationHotkeys } from '../shared/NavigationHotkeys'

import './History.css'

const History = ( { register, focused } ) => {
  const { transitionHistory, latestLines } = useContext( HistoryContext )

  return useMemo( () => (
    <ul className="history">
      {Object.entries( transitionHistory )
        .sort( ( [ t1 ], [ t2 ] ) => new Date( t2 ) - new Date( t1 ) )
        .map( ( [ , {
          timestamp,
          line: { id: lineId, shabadId, gurmukhi },
          bani,
          shabad,
        } ], index ) => {
          const historyId = bani ? bani.id : shabad.id
          const { line: latestLine } = latestLines[ historyId ] || {}

          const latestLineId = latestLine ? latestLine.id : lineId

          const onClick = () => ( bani
            ? controller.bani( { baniId: bani.id, lineId: latestLineId } )
            : controller.shabad( { shabadId, lineId: latestLineId } ) )

          return (
            <li
              className={focused === index ? 'focused' : ''}
              key={timestamp}
              ref={ref => register( index, ref )}
              onClick={onClick}
            >
              <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
              <span className="gurmukhi text">{bani ? bani.nameGurmukhi : stripVishraams( gurmukhi )}</span>
              <span className="timestamp meta">
                {new Date( timestamp ).toLocaleTimeString( navigator.language, { hour: '2-digit', minute: '2-digit', hour12: false } )}
              </span>
            </li>
          )
        } ) }

      <li onClick={() => transitionHistory.length && window.open( HISTORY_DOWNLOAD_URL )}>
        <span className="meta icon">
          <FontAwesomeIcon icon={faDownload} />
        </span>
        Export
      </li>

      <li onClick={controller.clearHistory}>
        <span className="meta icon">
          <FontAwesomeIcon icon={faTrash} />
        </span>
        Clear History
      </li>
    </ul>
  ), [ register, focused, transitionHistory, latestLines ] )
}

History.propTypes = {
  register: func.isRequired,
  focused: number,
}

History.defaultProps = {
  focused: 0,
}

export default withNavigationHotkeys( {
  arrowKeys: true,
  lineKeys: true,
} )( History )
