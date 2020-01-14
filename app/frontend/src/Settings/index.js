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
import { OPTIONS, OPTION_GROUPS } from '../lib/options'
import SHORTCUTS from '../lib/keyMap'
import { SettingsContext, StatusContext } from '../lib/contexts'

import ThemeLoader from '../shared/ThemeLoader'
import { withErrorFallback } from '../shared/ErrorFallback'

import Sources from './Sources'
import About from './About'
import Hotkeys from './Hotkeys'
import OverlaySettings from './OverlaySettings'
import DynamicOptions from './DynamicOptions'

import './index.css'

const Settings = () => {
  const { pathname } = useLocation()
  const group = pathname.split( '/' ).pop()

  const [ mobileOpen, setMobileOpen ] = useState( false )
  const [ device, setDevice ] = useState( 'local' )

  const settings = useContext( SettingsContext )

  // Fetch list of themes from server
  useEffect( () => {
    fetch( `${BACKEND_URL}/presenter/themes` )
      .then( res => res.json() )
      .then( themes => {
        OPTIONS.themeName.values = themes.map( theme => ( { name: theme, value: theme } ) )
      } )
  }, [] )

  // Fetch list of overlay themes from server
  useEffect( () => {
    fetch( `${BACKEND_URL}/overlay/themes` )
      .then( res => res.json() )
      .then( themes => {
        OPTIONS.overlayName.values = themes.map( theme => ( { name: theme, value: theme } ) )
      } )
  }, [] )

  const openMobileMenu = () => setMobileOpen( true )
  const closeMobileMenu = () => setMobileOpen( false )

  const { connected } = useContext( StatusContext )

  const renderMenuItems = () => {
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
        <Item name="Overlay" icon={faWindowMaximize} url={SETTINGS_OVERLAY_URL} selected={group === 'overlay'} />
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

  const renderTitlebar = () => (
    <AppBar className="title-bar" position="static">
      <Toolbar>
        <Hidden mdUp>
          <IconButton onClick={openMobileMenu}>
            <FontAwesomeIcon className="menu icon" icon={faBars} />
          </IconButton>
        </Hidden>
        <Typography className="title" align="center" variant="h6">{group}</Typography>
      </Toolbar>
    </AppBar>
  )

  const { theme: { simpleGraphics } } = settings.local
  const { theme: { themeName }, hotkeys } = settings[ device ]

  const defaultUrl = `${SETTINGS_DEVICE_URL}/${Object.keys( settings[ device ] )[ 0 ]}`
  const setSettings = settings => controller.setSettings( settings, device )

  return (
    <div className={classNames( { simple: simpleGraphics }, 'settings' )}>
      <ThemeLoader name={themeName} connected={connected} />

      {renderMenu()}
      {renderTitlebar()}

      <main onClick={closeMobileMenu}>
        <Switch>
          <Redirect exact from={SETTINGS_DEVICE_URL} to={defaultUrl} />

          {/* Device setting routes */}
          <Route path={`${SETTINGS_DEVICE_URL}/hotkeys`} render={() => <Hotkeys shortcuts={SHORTCUTS} keys={hotkeys} />} />
          <Route path={`${SETTINGS_DEVICE_URL}/sources`} render={() => <Sources sources={settings[ device ].sources} setSettings={setSettings} />} />
          <Route path={`${SETTINGS_DEVICE_URL}/*`} render={() => <DynamicOptions device={device} group={group} onChange={setSettings} />} />

          {/* Server setting routes */}
          <Route
            path={SETTINGS_ABOUT_URL}
            render={() => <About connected={Object.keys( settings ).length - 1} />}
          />
          <Route path={`${SETTINGS_SERVER_URL}/*`} render={() => <DynamicOptions device="global" group={group} onChange={setSettings} />} />

          {/* Tool Routes */}
          <Route path={SETTINGS_OVERLAY_URL} component={OverlaySettings} />

          <Redirect to={defaultUrl} />
        </Switch>
      </main>
    </div>
  )
}

export default hot( withErrorFallback( Settings ) )
