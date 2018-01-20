import React from 'react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/fontawesome-free-solid'

import './Navigator.css'

const Navigator = ( {} ) => (
  <div className="navigator">
    <AppBar className="title-bar">
      <Toolbar>
        <IconButton className="menu-icon">
          <FontAwesomeIcon icon={faBars} />
        </IconButton>
        <Typography className="name" type="title">
          Settings
        </Typography>
      </Toolbar>
    </AppBar>
  </div>
)

export default Navigator
