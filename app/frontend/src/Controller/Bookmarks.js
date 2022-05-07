import './Bookmarks.css'

import { List, ListItem } from '@material-ui/core'
import { func, number } from 'prop-types'
import { useContext } from 'react'

import { BookmarksContext } from '../lib/contexts'
import controller from '../lib/controller'
import { LINE_HOTKEYS } from '../lib/keyMap'
import { withNavigationHotkeys } from '../shared/NavigationHotkeys'

const Bookmarks = ( { register, focused } ) => {
  const bookmarks = useContext( BookmarksContext )

  return (
    <List className="bookmarks">
      {bookmarks.map( ( { id, nameGurmukhi }, index ) => (
        <ListItem
          className={focused === index ? 'focused' : ''}
          key={id}
          ref={( ref ) => register( index, ref )}
          onClick={() => controller.bani( { baniId: id } )}
        >
          <span className="hotkey meta">{LINE_HOTKEYS[ index ]}</span>
          <span className="gurmukhi text">{nameGurmukhi}</span>
        </ListItem>
      ) )}
    </List>
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
