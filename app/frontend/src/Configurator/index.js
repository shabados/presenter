import React, { Component } from 'react'
import { Redirect, Link, Switch, Route } from 'react-router-dom'
import { shape, string } from 'prop-types'
import { location } from 'react-router-prop-types'
import classNames from 'classnames'

import { AppBar, Toolbar, IconButton, Typography, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Select, MenuItem } from '@material-ui/core'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faBars, faWindowMaximize, faInfo } from '@fortawesome/fontawesome-free-solid'

import SettingComponentFactory from './SettingComponents'
import ThemeLoader from '../shared/ThemeLoader'

import {
  BACKEND_URL,
  CONFIGURATOR_URL,
  CONFIGURATOR_SETTINGS_URL,
  CONFIGURATOR_SERVER_SETTINGS_URL,
  CONFIGURATOR_OVERLAY_URL,
  CONFIGURATOR_ABOUT_URL,
  OPTIONS,
  DEFAULT_OPTIONS,
  OPTION_GROUPS,
  SHORTCUTS,
} from '../lib/consts'

import Sources from './Sources'
import About from './About'
import Hotkeys from './Hotkeys'
import OverlaySettings from './OverlaySettings'

import './index.css'
import controller from '../lib/controller'

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
    const { settings, location: { pathname } } = this.props

    const group = pathname.split( '/' ).pop()

    const Item = ( { name, icon, selected, url = CONFIGURATOR_URL } ) => (
      <Link to={url} onClick={this.toggleMobileMenu}>
        <ListItem disableRipple selected={selected} className="item" key={name} button>
          <ListItemIcon><FontAwesomeIcon className="icon" icon={icon} /></ListItemIcon>
          <ListItemText className="text" primary={name} />
        </ListItem>
      </Link>
    )

    return (
      <List>
        <Select
          className="device-selector category-title"
          onChange={( { target: { value } } ) => this.setState( { device: value } )}
          value={device}
          disableUnderline
        >
          <MenuItem value="local">This Device</MenuItem>
          {Object.keys( settings )
            .filter( name => ![ 'local', 'global' ].includes( name ) )
            .map( device => (
              <MenuItem
                key={device}
                value={device}
              >
                {device}
              </MenuItem> ) )}
        </Select>
        {Object.keys( settings[ device ] )
          .filter( name => OPTION_GROUPS[ name ] )
          .map( name => <Item key={name} selected={name === group} {...OPTION_GROUPS[ name ]} url={`${CONFIGURATOR_SETTINGS_URL}/${name}`} /> )}
        <Typography className="category-title">Server</Typography>
        {Object.keys( settings.global ).map( name => <Item key={name} selected={name === group} {...OPTION_GROUPS[ name ]} url={`${CONFIGURATOR_SERVER_SETTINGS_URL}/${name}`} /> )}
        <Item name="About" icon={faInfo} url={CONFIGURATOR_ABOUT_URL} />
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

    const defaultSettings = isServer ? DEFAULT_OPTIONS.global : DEFAULT_OPTIONS.local

    const setSettings = ( option, value ) => controller.setSettings( {
      [ group ]: { [ option ]: value },
    }, device )

    return Object.entries( defaultSettings[ group ] || {} ).map( ( [ option, defaultValue ] ) => {
      const optionGroup = settings[ device ][ group ] || {}
      const value = typeof optionGroup[ option ] === 'undefined' ? defaultValue : optionGroup[ option ]
      const options = OPTIONS[ option ]
      const { type } = options

      // Get correct component
      const Option = SettingComponentFactory( type )

      return <Option {...options} option={option} value={value} onChange={setSettings} />
    } )
  }


  Titlebar = ( { title = 'Settings' } ) => (
    <AppBar className="title-bar" position="static">
      <Toolbar>
        <Hidden mdUp>
          <IconButton onClick={this.toggleMobileMenu}>
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
        </Hidden>
        <Typography className="title" align="center" variant="title">{title}</Typography>
      </Toolbar>
    </AppBar>
  )

  render() {
    const { device } = this.state
    const { location: { pathname }, settings } = this.props

    const { theme: { simpleGraphics } } = settings.local
    const { theme: { themeName }, hotkeys } = settings[ device ]
    const group = pathname.split( '/' ).pop()

    const defaultUrl = `${CONFIGURATOR_SETTINGS_URL}/${Object.keys( settings[ device ] )[ 0 ]}`
    const setSettings = settings => controller.setSettings( settings, device )

    return (
      <div className={classNames( { simple: simpleGraphics }, 'configurator' )}>
        <ThemeLoader name={themeName} />
        <this.Titlebar title={group} />
        <Hidden smUp><this.MobileMenu /></Hidden>
        <Hidden xsDown implementation="css"><this.DesktopMenu /></Hidden>
        <main>
          <Switch>
            <Redirect exact from={CONFIGURATOR_SETTINGS_URL} to={defaultUrl} />
            <Route
              path={CONFIGURATOR_ABOUT_URL}
              render={() => <About connected={Object.keys( settings ).length - 1} />}
            />
            <Route path={`${CONFIGURATOR_SETTINGS_URL}/hotkeys`} render={() => <Hotkeys shortcuts={SHORTCUTS} keys={hotkeys} />} />
            <Route path={`${CONFIGURATOR_SETTINGS_URL}/sources`} render={() => <Sources sources={settings[ device ].sources} setSettings={setSettings} />} />
            <Route path={`${CONFIGURATOR_SETTINGS_URL}/*`} component={this.DynamicOptions} />
            <Route path={CONFIGURATOR_OVERLAY_URL} component={OverlaySettings} />
            <Redirect to={defaultUrl} />
          </Switch>
        </main>
      </div>
    )
  }
}

Configurator.propTypes = {
  settings: shape( { local: shape( {
    theme: shape( { options: shape( { themeName: string } ) } ),
  } ) } ).isRequired,
  location: location.isRequired,
}

export default Configurator
