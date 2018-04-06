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

import HotKeysWrapper from '../HotKeysWrapper'

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
const Menu = ( { history } ) => (
    <List className="menu">
      <HotKeysWrapper>
        {items.map( ( [ name, icon, route ] ) => (
          <ListItem
            key={route}
            onClick={() => history.push( `${NAVIGATOR_URL}/${route}` )}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={icon} />
            </ListItemIcon>
            {name}
          </ListItem>
        ) )}
      </HotKeysWrapper>
    </List>
)

export default Menu
