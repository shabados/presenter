import React from 'react'

import { List, ListItem, ListItemIcon } from '@material-ui/core'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  faCogs,
  faSearch,
  faHistory,
  faBookOpen,
  faWindowRestore,
  faList,
} from '@fortawesome/fontawesome-free-solid'

import { CONTROLLER_URL } from '../lib/consts'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import './Menu.css'

const items = [
  [ 'Search', faSearch, 'search' ],
  [ 'Navigator', faList, 'navigator' ],
  [ 'History', faHistory, 'history' ],
  [ 'Banis', faBookOpen, 'bookmarks' ],
  [ 'Live Captions Tool', faWindowRestore, 'live-captions' ],
  [ 'Settings', faCogs, 'settings' ],
]

/**
 * Menu component.
 * Renders all the names, icons, and routes from `items`.
 */
const Menu = ( { history, location, register, focused } ) => (
  <List className="menu">
    {items.map( ( [ name, icon, route ] ) => (
      <ListItem
        key={route}
        onClick={() => history.push( { ...location, pathname: `${CONTROLLER_URL}/${route}` } )}
        ref={c => register( name, c )}
        className={focused === name ? 'focused' : ''}
      >
        <ListItemIcon className="meta">
          <FontAwesomeIcon icon={icon} />
        </ListItemIcon>
        {name}
      </ListItem>
    ) )}
  </List>
)

export default withNavigationHotKeys( {} )( Menu )
