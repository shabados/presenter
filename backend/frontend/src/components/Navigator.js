import React from 'react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  faBars,
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faWindowMinimize,
  faSignOutAlt,
  faSearch,
  faHistory,
  faBookmark,
} from '@fortawesome/fontawesome-free-solid'

import {
  faSquare,
} from '@fortawesome/fontawesome-free-regular'

import './Navigator.css'

const Navigator = ( {} ) => (
  <div className="navigator">
    <AppBar className="title-bar">
      <Toolbar>
        <IconButton>
          <FontAwesomeIcon icon={faBars} />
        </IconButton>
        <IconButton>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
        </IconButton>
        <IconButton>
          <FontAwesomeIcon icon={faArrowAltCircleRight} />
        </IconButton>
        <Typography className="name" type="title">
          Settings
        </Typography>
        <IconButton>
          <FontAwesomeIcon icon={faWindowMinimize} />
        </IconButton>
        <IconButton>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </IconButton>
      </Toolbar>
    </AppBar>

    <AppBar className="bottom-bar">
      <Toolbar>
        <IconButton>
          <FontAwesomeIcon icon={faSearch} />
        </IconButton>
        <IconButton>
          <FontAwesomeIcon icon={faHistory} />
        </IconButton>
        <IconButton>
          <FontAwesomeIcon icon={faBookmark} />
        </IconButton>
        <Typography className="name" type="title" />
        <IconButton>
          <FontAwesomeIcon icon={faSquare} />
        </IconButton>
      </Toolbar>
    </AppBar>
  </div>
)

export default Navigator
