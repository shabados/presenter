import React, { Component } from 'react'
import { Redirect, Link, Switch, Route, withRouter } from 'react-router-dom'

import { AppBar, Toolbar, IconButton, Typography, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Select, MenuItem } from '@material-ui/core'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faBars, faWindowMaximize, faQuestion } from '@fortawesome/fontawesome-free-solid'

import SettingComponentFactory from './SettingComponents'
import ThemeLoader from '../shared/ThemeLoader'

import {
  CONFIGURATOR_URL,
  CONFIGURATOR_SETTINGS_URL,
  CONFIGURATOR_SERVER_SETTINGS_URL,
  CONFIGURATOR_OVERLAY_URL,
  OPTIONS,
  DEFAULT_OPTIONS,
  OPTION_GROUPS,
  BACKEND_URL,
} from '../lib/consts'

import OverlaySettings from './OverlaySettings'

import './index.css'

class Configurator extends Component {
  state = {
    mobileOpen: false,
    device: 'local',
  }

  componentDidMount() {
    // Fetch list of themes from server
    fetch( `${BACKEND_URL}/themes` )
      .then( res => res.json() )
      .then( themes => {
        OPTIONS.themeName.values = themes.map( theme => ( { name: theme, value: theme } ) )
        this.setState( {} )
      } )
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
        {Object.keys( settings[ device ] ).map( name => <Item key={name} {...OPTION_GROUPS[ name ]} url={`${CONFIGURATOR_SETTINGS_URL}/${name}`} /> )}
        <Typography className="category-title">Server</Typography>
        {Object.keys( settings.global ).map( name => <Item key={name} {...OPTION_GROUPS[ name ]} url={`${CONFIGURATOR_SERVER_SETTINGS_URL}/${name}`} /> )}
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

    const isServer = pathname.split( '/' ).includes( 'server' )
    const device = isServer ? 'global' : this.state.device

    // Fetch correct option group from URL
    const group = pathname.split( '/' ).pop()

    const defaultSettings = device === 'server' ? DEFAULT_OPTIONS.global : DEFAULT_OPTIONS.local

    return Object.entries( defaultSettings[ group ] || {} ).map( ( [ option, defaultValue ] ) => {
      const optionGroup = settings[ device ][ group ] || {}
      const value = typeof optionGroup[ option ] === 'undefined' ? defaultValue : optionGroup[ option ]
      const options = OPTIONS[ option ]
      const { type } = options

      console.log( option, options, value )

      // Get correct component
      const Option = SettingComponentFactory( type )( group, device )

      return <Option {...options} option={option} value={value} />
    } )
  }

  render() {
    const { settings } = this.props
    const { theme: { themeName } } = settings.local

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
