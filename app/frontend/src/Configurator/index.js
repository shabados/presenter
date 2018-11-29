import React, { Component } from 'react'
import { Redirect, Link, Switch, Route, withRouter } from 'react-router-dom'

import { AppBar, Toolbar, IconButton, Typography, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Select, MenuItem } from '@material-ui/core'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faBars, faWindowMaximize } from '@fortawesome/fontawesome-free-solid'

import ThemeLoader from '../shared/ThemeLoader'

import {
  CONFIGURATOR_URL,
  CONFIGURATOR_SETTINGS_URL,
  CONFIGURATOR_OVERLAY_URL,
  OPTIONS,
  DEFAULT_OPTIONS,
  OPTION_TYPES,
} from '../lib/consts'

import OverlaySettings from './OverlaySettings'

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

    const Item = ( { name, icon, url = CONFIGURATOR_URL } ) => (
      <Link to={url}>
        <ListItem className="item" key={name} button>
          <ListItemIcon><FontAwesomeIcon className="icon" icon={icon} /></ListItemIcon>
          <ListItemText className="text" primary={name} />
        </ListItem>
      </Link>
    )

    console.log( this.props )
    return (
      <List>
        <Select className="device-selector category-title" value={device} disableUnderline>
          <MenuItem value="local">This Device</MenuItem>
          {Object.keys( settings )
            .filter( name => ![ 'local', 'global' ].includes( name ) )
            .map( device => (
              <MenuItem
                key={device}
                onClick={() => this.setState( { device } )}
                value={device}
              >
                {device}
              </MenuItem> ) )}
        </Select>
        {Object.entries( settings[ device ] ).map( ( [ name, props ] ) => <Item {...props} url={`${CONFIGURATOR_SETTINGS_URL}/${name}`} /> )}
        <Typography className="category-title">Server</Typography>
        {Object.values( settings.global ).map( Item )}
        <Typography className="category-title">Tools</Typography>
        <Item name="Overlay" icon={faWindowMaximize} url={CONFIGURATOR_OVERLAY_URL} />
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

  DynamicOptions = () => {
    const { settings, location: { pathname } } = this.props
    const { device } = this.state

    const typeComponents = {
      [ OPTION_TYPES.dropdown ]: ( { name, value } ) => <p>dropdown {name}: {value.name}</p>,
      [ OPTION_TYPES.radio ]: ( { name, value } ) => <p>radio {name}: {value}</p>,
      [ OPTION_TYPES.toggle ]: ( { name, value } ) => <p>toggle {name}: {value}</p>,
      [ OPTION_TYPES.slider ]: ( { name, value } ) => <p>slider {name}: {value}</p>,
      [ OPTION_TYPES.colorPicker ]: ( { name, value } ) => <p>colorPicker {name}: {value}</p>,
    }

    // Fetch correct option group from URL
    const group = pathname.split( '/' ).pop()
    const { options } = settings[ device ][ group ] || DEFAULT_OPTIONS.local[ group ]

    return Object.entries( options ).map( ( [ option, value ] ) => {
      const { name, type } = OPTIONS[ option ]
      const Option = typeComponents[ type ]
      return <Option name={name} value={value} />
    } )
  }

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
          <Switch>
            <Route path={`${CONFIGURATOR_SETTINGS_URL}/*`} component={this.DynamicOptions} />
            <Route path={CONFIGURATOR_OVERLAY_URL} component={OverlaySettings} />
            <Redirect to={`${CONFIGURATOR_SETTINGS_URL}/${Object.keys( settings[ device ] )[ 0 ]}`} />
          </Switch>
        </main>
      </div>
    )
  }
}

export default withRouter( Configurator )
