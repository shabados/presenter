import React from 'react'

import { List, ListItem, ListItemIcon } from '@material-ui/core'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'
import './Devices.css'

const Devices = ( { devices } ) => (
  <List className="devices">
    { devices.map( device => (
      <ListItem>
        { device }
      </ListItem>
    ) ) }
  </List>
)

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
} )( Devices )
