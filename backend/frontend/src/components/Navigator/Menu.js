import React from 'react'
import { Link } from 'react-router-dom'

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
const Menu = () => (
  <List className="menu">
    {items.map( ( [ name, icon, route ], i ) => (
      <Link key={route} to={`${NAVIGATOR_URL}/${route}`} tabIndex={i + 1}>
        <ListItem>
          <ListItemIcon>
            <FontAwesomeIcon icon={icon} />
          </ListItemIcon>
          {name}
        </ListItem>
      </Link>
    ) )}
  </List>
)

export default Menu
