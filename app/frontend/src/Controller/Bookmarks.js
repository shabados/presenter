import React from 'react'
import { arrayOf, shape, string, func, number, instanceOf, objectOf } from 'prop-types'

import { List, ListItem } from '@material-ui/core'

import { LINE_HOTKEYS } from '../lib/keyMap'
import controller from '../lib/controller'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import './Bookmarks.css'


const Bookmarks = ( { banis, transitionHistory, latestLines, register, focused } ) => {
  const onClick = id => {
    // Find the latest line from the bani, optionally
    const { timestamp } = transitionHistory.find( ( { bani } ) => bani && bani.id === id ) || {}

    const { line: latestLine } = latestLines[ timestamp ] || {}

    // Use timestamp to get latest line for that navigation period
    const latestLineId = latestLine ? latestLine.id : null

    controller.bani( { baniId: id, lineId: latestLineId } )
  }

  return (
    <List className="bookmarks">
      {banis.map( ( { id, nameGurmukhi }, index ) => (
        <ListItem
          className={focused === index ? 'focused' : ''}
          key={id}
          ref={ref => register( index, ref )}
          onClick={() => onClick( id )}
        >
          <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
          <span className="gurmukhi text">{nameGurmukhi}</span>
        </ListItem>
      ) )}
    </List>
  )
}

const lineHistoryType = shape( {
  timestamp: instanceOf( Date ),
  line: shape( {
    id: string,
    shabadId: string,
    gurmukhi: string,
  } ),
  bani: shape( { nameGurmukhi: string } ),
} )

Bookmarks.propTypes = {
  banis: arrayOf( shape( {
    id: string,
    name: string,
  } ) ).isRequired,
  transitionHistory: arrayOf( lineHistoryType ),
  latestLines: objectOf( lineHistoryType ),
  register: func.isRequired,
  focused: number.isRequired,
}

Bookmarks.defaultProps = {
  transitionHistory: [],
  latestLines: {},
}

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
} )( Bookmarks )
