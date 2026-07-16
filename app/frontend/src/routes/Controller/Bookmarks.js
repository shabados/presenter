import React, { useContext } from 'react'
import { func, number } from 'prop-types'

import { LINE_HOTKEYS } from '../../lib/keyMap'
import controller from '../../lib/controller'
import { BookmarksContext } from '../../lib/contexts'

import { withNavigationHotkeys } from '../../hotkeys/NavigationHotkeys'

import './Bookmarks.css'

const Bookmarks = ( { register, focused } ) => {
  const bookmarks = useContext( BookmarksContext )

  return (
    <ul className="bookmarks">
      {bookmarks.map( ( { id, nameGurmukhi }, index ) => (
        <li
          className={focused === index ? 'focused' : ''}
          key={id}
          ref={ref => register( index, ref )}
          onClick={() => controller.bani( { baniId: id } )}
        >
          <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
          <span className="gurmukhi text">{nameGurmukhi}</span>
        </li>
      ) )}
    </ul>
  )
}

Bookmarks.propTypes = {
  register: func.isRequired,
  focused: number,
}

Bookmarks.defaultProps = {
  focused: 0,
}

export default withNavigationHotkeys( {
  arrowKeys: true,
  lineKeys: true,
} )( Bookmarks )
