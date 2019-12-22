/* eslint-disable
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-noninteractive-element-interactions
*/
import React, { useState, useEffect, useContext } from 'react'
import { string, bool, shape } from 'prop-types'
import { hot } from 'react-hot-loader/root'
import { Redirect, Link, Switch, Route, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  SwipeableDrawer,
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
import { SettingsContext, StatusContext } from '../lib/contexts'

import ThemeLoader from '../shared/ThemeLoader'
import { withErrorFallback } from '../shared/ErrorFallback'

import SettingComponentFactory from './SettingComponents'
import Sources from './Sources'
import About from './About'
import Hotkeys from './Hotkeys'
import OverlaySettings from './OverlaySettings'

import './index.css'

const Settings = () => {
  const { pathname } = useLocation()

  const [ mobileOpen, setMobileOpen ] = useState( false )
  const [ device, setDevice ] = useState( 'local' )

  const settings = useContext( SettingsContext )

  // Fetch list of themes from server
  useEffect( () => {
    fetch( `${BACKEND_URL}/themes` )
      .then( res => res.json() )
      .then( themes => {
        OPTIONS.themeName.values = themes.map( theme => ( { name: theme, value: theme } ) )
      } )
  }, [] )

  const openMobileMenu = () => setMobileOpen( true )
  const closeMobileMenu = () => setMobileOpen( false )

  const { connected } = useContext( StatusContext )

  const renderMenuItems = () => {
    const group = pathname.split( '/' ).pop()

    const Item = ( { name, icon, selected, url = SETTINGS_URL } ) => (
      <Link to={url} onClick={closeMobileMenu}>
        <ListItem disableRipple selected={selected} className="item" key={name} button>
          <ListItemIcon>
            <FontAwesomeIcon className="icon" icon={icon} />
          </ListItemIcon>
          <ListItemText className="text" primary={name} />
        </ListItem>
      </Link>
    )

    Item.propTypes = {
      name: string.isRequired,
      icon: shape( { name: string } ).isRequired,
      selected: bool,
      url: string.isRequired,
    }

    Item.defaultProps = {
      selected: false,
    }

    return (
      <List className="content">
        <Select
          className="select-menu device-selector category-title"
          onChange={( { target: { value } } ) => setDevice( value )}
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

  const renderMenu = () => (
    <>
      <Hidden smUp implementation="css">
        <SwipeableDrawer
          className={classNames( { open: mobileOpen }, 'mobile menu' )}
          open={mobileOpen}
          onOpen={openMobileMenu}
          onClose={closeMobileMenu}
          ModalProps={{ keepMounted: true }}
        >
          {renderMenuItems()}
        </SwipeableDrawer>
      </Hidden>

      <Hidden xsDown>
        <Drawer className="desktop menu" variant="permanent" open>{renderMenuItems()}</Drawer>
      </Hidden>
    </>
  )

  const renderDynamicOptions = () => {
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

  const renderTitlebar = ( { title = 'Settings' } ) => (
    <AppBar className="title-bar" position="static">
      <Toolbar>
        <Hidden mdUp>
          <IconButton onClick={openMobileMenu}>
            <FontAwesomeIcon className="menu icon" icon={faBars} />
          </IconButton>
        </Hidden>
        <Typography className="title" align="center" variant="h6">{title}</Typography>
      </Toolbar>
    </AppBar>
  )

  renderTitlebar.propTypes = {
    title: string.isRequired,
  }

  const { theme: { simpleGraphics } } = settings.local
  const { theme: { themeName }, hotkeys } = settings[ device ]
  const group = pathname.split( '/' ).pop()

  const defaultUrl = `${SETTINGS_DEVICE_URL}/${Object.keys( settings[ device ] )[ 0 ]}`
  const setSettings = settings => controller.setSettings( settings, device )

  return (
    <div className={classNames( { simple: simpleGraphics }, 'settings' )}>
      <ThemeLoader name={themeName} connected={connected} />

      {renderMenu()}
      {renderTitlebar( { title: group } )}

      <main onClick={closeMobileMenu}>
        <Switch>
          <Redirect exact from={SETTINGS_DEVICE_URL} to={defaultUrl} />

          <Route
            path={SETTINGS_ABOUT_URL}
            render={() => <About connected={Object.keys( settings ).length - 1} />}
          />
          <Route path={`${SETTINGS_DEVICE_URL}/hotkeys`} render={() => <Hotkeys shortcuts={SHORTCUTS} keys={hotkeys} />} />
          <Route path={`${SETTINGS_DEVICE_URL}/sources`} render={() => <Sources sources={settings[ device ].sources} setSettings={setSettings} />} />
          <Route path={`${SETTINGS_DEVICE_URL}/*`} render={renderDynamicOptions} />
          <Route path={SETTINGS_OVERLAY_URL} component={OverlaySettings} />

          <Redirect to={defaultUrl} />
        </Switch>
      </main>
    </div>
  )
}

export default hot( withErrorFallback( Settings ) )
