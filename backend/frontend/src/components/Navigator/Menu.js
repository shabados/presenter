import React from 'react'

import { List, ListItem, ListItemIcon } from 'material-ui'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  faCogs,
  faSearch,
  faHistory,
  faBookmark,
  faWindowRestore,
} from '@fortawesome/fontawesome-free-solid'

import { NAVIGATOR_URL } from '../../lib/consts'

import withNavigationHotKeys from '../withNavigationHotKeys'

import './Menu.css'

const items = [
  [ 'Search', faSearch, 'search' ],
  [ 'History', faHistory, 'history' ],
  [ 'Bookmarks', faBookmark, 'bookmarks' ],
  [ 'Live Captions Tool', faWindowRestore, 'live-captions' ],
  [ 'Settings', faCogs, 'settings' ],
]

/**
 * Menu component.
 * Renders all the names, icons, and routes from `items`.
 */
const Menu = ( { history, register, focused } ) => (
  <List className="menu">
    {items.map( ( [ name, icon, route ], i ) => (
      <ListItem
        key={route}
        onClick={() => history.push( `${NAVIGATOR_URL}/${route}` )}
        ref={c => register( i, c )}
        className={focused === i ? 'focused' : ''}
      >
        <ListItemIcon>
          <FontAwesomeIcon icon={icon} />
        </ListItemIcon>
        {name}
      </ListItem>
    ) )}
  </List>
)

export default withNavigationHotKeys( Menu )
