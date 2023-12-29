import './Bookmarks.css'

import { List, ListItem } from '@mui/material'
import { useContext } from 'react'

import { BookmarksContext } from '../lib/contexts'
import controller from '../lib/controller'
import { LINE_HOTKEYS } from '../lib/keyMap'
import { withNavigationHotkeys } from '../shared/NavigationHotkeys'

type BookmarkProps = {
  focused?: number,
  register: ( index: number, ref: HTMLElement | null ) => void,
}

const Bookmarks = ( { register, focused = 0 }: BookmarkProps ) => {
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

export default withNavigationHotkeys( {
  arrowKeys: true,
  lineKeys: true,
} )( Bookmarks )
