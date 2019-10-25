import React from 'react'
import { string, func } from 'prop-types'
import { history, location } from 'react-router-prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faSearch,
  faHistory,
  faBookOpen,
  faList,
} from '@fortawesome/free-solid-svg-icons'

import { CONTROLLER_URL } from '../lib/consts'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'

import './Menu.css'

const items = [
  [ 'Search', faSearch, 'search' ],
  [ 'Navigator', faList, 'navigator' ],
  [ 'History', faHistory, 'history' ],
  [ 'Bookmarks', faBookOpen, 'bookmarks' ],
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

Menu.propTypes = {
  history: history.isRequired,
  location: location.isRequired,
  focused: string,
  register: func.isRequired,
}

Menu.defaultProps = {
  focused: items[ 0 ][ 0 ],
}

export default withNavigationHotKeys( {} )( Menu )
