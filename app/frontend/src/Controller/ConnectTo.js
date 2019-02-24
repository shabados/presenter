import React from 'react'

import { List, ListItem, ListItemIcon } from '@material-ui/core'

import withNavigationHotKeys from '../shared/withNavigationHotKeys'
import './ConnectTo.css'

const ConnectTo = ( { discoveredDevices } ) => (
  <List className="devices">
    { discoveredDevices.map( device => (
      <ListItem>
        { device }
      </ListItem>
    ) ) }
  </List>
)

export default withNavigationHotKeys( {
  arrowKeys: true,
  lineKeys: true,
} )( ConnectTo )
