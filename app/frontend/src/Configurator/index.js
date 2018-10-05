import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'

import { AppBar, Toolbar, IconButton, Typography, Drawer, Hidden, List, ListItem, Divider, ListItemIcon, ListItemText, Select, MenuItem } from '@material-ui/core'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/fontawesome-free-solid'

import ThemeLoader from '../shared/ThemeLoader'

import { CONFIGURATOR_SETTINGS_URL } from '../lib/consts'

import './index.css'

class Configurator extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      mobileOpen: false,
      device: 'local',
    }
  }

  toggleMobileMenu = () => this.setState( { mobileOpen: !this.state.mobileOpen } )

  MenuItems = () => {
    const { device } = this.state
    const { settings } = this.props

    const Item = ( { name, icon } ) => (
      <ListItem className="item" button>
        <ListItemIcon><FontAwesomeIcon className="icon" icon={icon} /></ListItemIcon>
        <ListItemText className="text" primary={name} />
      </ListItem>
    )

    return (
      <List>
        <Select className="device-selector category-title" value={device} disableUnderline>
          <MenuItem value="local">This Device</MenuItem>
          {Object.keys( settings )
            .filter( name => ![ 'local', 'global' ].includes( name ) )
            .map( device => (
              <MenuItem
                onClick={() => this.setState( { device } )}
                value={device}
              >
                {device}
              </MenuItem> ) )}
        </Select>
        {Object.values( settings[ device ] ).map( Item )}
        <Typography className="category-title">Server</Typography>
        {Object.values( settings.global ).map( Item )}
      </List>
    )
  }

  MobileMenu = () => {
    const { mobileOpen } = this.state

    return (
      <Drawer className="mobile menu" variant="temporary" open={mobileOpen} onClose={this.toggleMobileMenu} ModalProps={{ keepMounted: true }}>
        <this.MenuItems />
      </Drawer>
    )
  }

  DesktopMenu = () => <Drawer className="desktop menu" variant="permanent" open><this.MenuItems /></Drawer>

  render() {
    const { settings } = this.props
    const { theme: { options: { themeName } } } = settings.local

    const { device } = this.state

    return (
      <div className="configurator">
        <ThemeLoader name={themeName} />
        <AppBar className="title-bar" position="static">
          <Toolbar>
            <Hidden mdUp>
              <IconButton onClick={this.toggleMobileMenu}>
                <FontAwesomeIcon icon={faBars} />
              </IconButton>
            </Hidden>
            <Typography className="title" align="center" variant="title">Layout</Typography>
          </Toolbar>
        </AppBar>
        <Hidden smUp><this.MobileMenu /></Hidden>
        <Hidden xsDown implementation="css"><this.DesktopMenu /></Hidden>
        <main>
          <Route path={CONFIGURATOR_SETTINGS_URL} component={() => <p>oi</p>} />
        </main>
      </div>
    )
  }
}

export default Configurator
