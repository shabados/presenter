import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'
import { Redirect, Link, Switch, Route } from 'react-router-dom'
import { shape, string, bool } from 'prop-types'
import { location } from 'react-router-prop-types'
import classNames from 'classnames'

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Select,
  MenuItem,
  Grid,
} from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faWindowMaximize, faInfo } from '@fortawesome/free-solid-svg-icons'

import controller from '../lib/controller'
import {
  BACKEND_URL,
  SETTINGS_URL,
  SETTINGS_DEVICE_URL,
  SETTINGS_SERVER_URL,
  SETTINGS_OVERLAY_URL,
  SETTINGS_ABOUT_URL,
} from '../lib/consts'
import { OPTIONS, DEFAULT_OPTIONS, OPTION_GROUPS } from '../lib/options'
import SHORTCUTS from '../lib/keyMap'

import ThemeLoader from '../shared/ThemeLoader'
import { withErrorFallback } from '../shared/ErrorFallback'

import SettingComponentFactory from './SettingComponents'
import Sources from './Sources'
import About from './About'
import Hotkeys from './Hotkeys'
import OverlaySettings from './OverlaySettings'

import './index.css'

class Settings extends Component {
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

  toggleMobileMenu = () => this.setState( ( { mobileOpen } ) => ( { mobileOpen: !mobileOpen } ) )

  MenuItems = () => {
    const { device } = this.state
    const { settings, location: { pathname } } = this.props

    const group = pathname.split( '/' ).pop()

    const Item = ( { name, icon, selected, url = SETTINGS_URL } ) => (
      <Link to={url} onClick={this.toggleMobileMenu}>
        <ListItem disableRipple selected={selected} className="item" key={name} button>
          <ListItemIcon>
            <FontAwesomeIcon className="icon" icon={icon} />
          </ListItemIcon>
          <ListItemText className="text" primary={name} />
        </ListItem>
      </Link>
    )

    return (
      <List>
        <Select
          className="select-menu device-selector category-title"
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
              </MenuItem>
            ) )}
        </Select>
        {Object.keys( settings[ device ] )
          .filter( name => OPTION_GROUPS[ name ] )
          .map( name => (
            <Item
              key={name}
              selected={name === group}
              {...OPTION_GROUPS[ name ]}
              url={`${SETTINGS_DEVICE_URL}/${name}`}
            />
          ) )}
        <Typography className="category-title">Server</Typography>
        {Object.keys( settings.global )
          .filter( name => OPTION_GROUPS[ name ] )
          .map( name => (
            <Item
              key={name}
              selected={name === group}
              {...OPTION_GROUPS[ name ]}
              url={`${SETTINGS_SERVER_URL}/${name}`}
            />
          ) )}
        <Item name="About" icon={faInfo} url={SETTINGS_ABOUT_URL} selected={group === 'about'} />
        <Typography className="category-title">Tools</Typography>
        <Item name="Overlay" icon={faWindowMaximize} url={SETTINGS_OVERLAY_URL} />
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

    const isServer = pathname.split( '/' ).includes( 'server' )
    const selectedDevice = isServer ? 'global' : device

    // Fetch correct option group from URL
    const group = pathname.split( '/' ).pop()

    const defaultSettings = isServer ? DEFAULT_OPTIONS.global : DEFAULT_OPTIONS.local

    const setSettings = ( option, value ) => controller.setSettings( {
      [ group ]: { [ option ]: value },
    }, selectedDevice )

    return Object.entries( defaultSettings[ group ] || {} ).map( ( [ option, defaultValue ] ) => {
      const optionGroup = settings[ selectedDevice ][ group ] || {}
      const value = typeof optionGroup[ option ] === 'undefined' ? defaultValue : optionGroup[ option ]
      const options = OPTIONS[ option ]
      const { type, privacy, name, icon, ...props } = options

      // Get correct component
      const Option = SettingComponentFactory( type )

      return (
        <Grid key={option} container className="option" alignItems="center">
          <Grid item xs={2} sm={1}>{icon && <FontAwesomeIcon className="icon" icon={icon} />}</Grid>
          <Grid item xs={5} sm={6} md={4} lg={3}><Typography>{name}</Typography></Grid>
          <Grid item xs={5} sm={5} md={4} lg={3} align="center">
            <Option {...props} option={option} value={value} onChange={setSettings} />
          </Grid>
        </Grid>
      )
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
        <Typography className="title" align="center" variant="h6">{title}</Typography>
      </Toolbar>
    </AppBar>
  )

  render() {
    const { device } = this.state
    const { location: { pathname }, settings, connected } = this.props

    const { theme: { simpleGraphics } } = settings.local
    const { theme: { themeName }, hotkeys } = settings[ device ]
    const group = pathname.split( '/' ).pop()

    const defaultUrl = `${SETTINGS_DEVICE_URL}/${Object.keys( settings[ device ] )[ 0 ]}`
    const setSettings = settings => controller.setSettings( settings, device )

    return (
      <div className={classNames( { simple: simpleGraphics }, 'settings' )}>
        <ThemeLoader name={themeName} connected={connected} />
        <this.Titlebar title={group} />
        <Hidden smUp><this.MobileMenu /></Hidden>
        <Hidden xsDown implementation="css"><this.DesktopMenu /></Hidden>
        <main>
          <Switch>
            <Redirect exact from={SETTINGS_DEVICE_URL} to={defaultUrl} />
            <Route
              path={SETTINGS_ABOUT_URL}
              render={() => <About connected={Object.keys( settings ).length - 1} />}
            />
            <Route path={`${SETTINGS_DEVICE_URL}/hotkeys`} render={() => <Hotkeys shortcuts={SHORTCUTS} keys={hotkeys} />} />
            <Route path={`${SETTINGS_DEVICE_URL}/sources`} render={() => <Sources sources={settings[ device ].sources} setSettings={setSettings} />} />
            <Route path={`${SETTINGS_DEVICE_URL}/*`} component={this.DynamicOptions} />
            <Route path={SETTINGS_OVERLAY_URL} component={OverlaySettings} />
            <Redirect to={defaultUrl} />
          </Switch>
        </main>
      </div>
    )
  }
}

Settings.propTypes = {
  connected: bool.isRequired,
  settings: shape( { local: shape( {
    theme: shape( { options: shape( { themeName: string } ) } ),
  } ) } ).isRequired,
  location: location.isRequired,
}

export default hot( withErrorFallback( Settings ) )
