import './index.css'

import { List, ListItem } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useContext } from 'react'

import { withNavigationHotkeys } from '~/components/NavigationHotkeys'
import { BookmarksContext } from '~/helpers/contexts'
import { LINE_HOTKEYS } from '~/helpers/keyMap'
import controller from '~/services/controller'

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

export const Route = createFileRoute( '/presenter/controller/bookmarks/' )( {
  component: withNavigationHotkeys( {
    arrowKeys: true,
    lineKeys: true,
  } )( Bookmarks ),
} )
