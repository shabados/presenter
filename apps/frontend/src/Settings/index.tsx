/* eslint-disable
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-noninteractive-element-interactions
*/
import './index.css'

import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  AppBar,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@mui/material'
import classNames from 'classnames'
import { bool, func, shape, string } from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import {
  BACKEND_URL,
  SETTINGS_ABOUT_URL,
  SETTINGS_DEVICE_URL,
  SETTINGS_SERVER_URL,
  SETTINGS_TOOLS_URL,
  SETTINGS_URL,
} from '../lib/consts'
import { SettingsContext } from '../lib/contexts'
import SHORTCUTS from '../lib/keyMap'
import { FLAT_OPTION_GROUPS, OPTION_GROUPS, OPTIONS } from '../lib/options'
import { withErrorFallback } from '../shared/ErrorFallback'
import ThemeLoader from '../shared/ThemeLoader'
import About from './About'
import ClosedCaptionSettings from './ClosedCaptionSettings'
import DynamicOptions from './DynamicOptions'
import Hotkeys from './Hotkeys'
import OverlaySettings from './OverlaySettings'
import Sources from './Sources'

const Item = ( { name, icon, selected, url = SETTINGS_URL, onClick } ) => (
  <Link to={url} onClick={onClick}>
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
  onClick: func,
}

Item.defaultProps = {
  selected: false,
}

const Settings = () => {
  const { pathname } = useLocation()
  const group = pathname.split( '/' ).pop()
  const { name } = FLAT_OPTION_GROUPS[ group ] || { name: group }

  const [ mobileOpen, setMobileOpen ] = useState( false )
  const [ device, setDevice ] = useState( 'local' )

  const settings = useContext( SettingsContext )

  const devices = Array.from( Object.keys( settings ) )

  const selectedDeviceSettings = settings[ device ] || settings.local

  useEffect( () => {
    if ( !devices.includes( device ) ) setDevice( 'local' )
  }, [ device, devices ] )

  // Fetch list of themes from server
  useEffect( () => {
    fetch( `${BACKEND_URL}/presenter/themes` )
      .then( ( res ) => res.json() )
      .then( ( themes ) => {
        OPTIONS.themeName.values = themes.map( ( theme ) => ( { name: theme, value: theme } ) )
      } )
  }, [] )

  const openMobileMenu = () => setMobileOpen( true )
  const closeMobileMenu = () => setMobileOpen( false )

  const menu = [
    [ null, OPTION_GROUPS.none, selectedDeviceSettings, SETTINGS_DEVICE_URL ],
    [ 'Activities', OPTION_GROUPS.activities, selectedDeviceSettings, SETTINGS_DEVICE_URL ],
    [ 'Server', OPTION_GROUPS.server, settings.global, SETTINGS_SERVER_URL ],
    [ 'Tools', OPTION_GROUPS.tools, settings.global, SETTINGS_TOOLS_URL ],
  ]

  const menuItems = (
    <List className="content">
      <Select
        className="select-menu device-selector category-title"
        onChange={( { target: { value } } ) => setDevice( value )}
        value={device}
        disableUnderline
      >
        <MenuItem value="local">This Device</MenuItem>
        {Object.keys( settings )
          .filter( ( name ) => ![ 'local', 'global' ].includes( name ) )
          .map( ( device ) => (
            <MenuItem key={device} value={device}>
              {device}
            </MenuItem>
          ) )}
      </Select>

      {menu.map( ( [ sectionName, settingsGroup, , url ] ) => (
        <>
          {sectionName && <Typography key={sectionName} className="category-title">{sectionName}</Typography>}

          {Object.keys( settingsGroup )
            .map( ( name ) => (
              <Item
                key={name}
                selected={name === group}
                {...settingsGroup[ name ]}
                url={`${url}/${name}`}
                onClick={closeMobileMenu}
              />
            ) ) }
        </>
      ) ) }
    </List>
  )

  const { theme: { simpleGraphics } } = settings.local
  const { theme: { themeName } = {}, hotkeys } = selectedDeviceSettings

  const defaultUrl = `${SETTINGS_DEVICE_URL}/${Object.keys( selectedDeviceSettings )[ 0 ]}`

  return (
    <div className={classNames( { simple: simpleGraphics }, 'settings' )}>
      <ThemeLoader name={themeName} />

      <Hidden smUp implementation="css">
        <SwipeableDrawer
          className={classNames( { open: mobileOpen }, 'mobile menu' )}
          open={mobileOpen}
          onOpen={openMobileMenu}
          onClose={closeMobileMenu}
          ModalProps={{ keepMounted: true }}
        >
          {menuItems}
        </SwipeableDrawer>
      </Hidden>

      <Hidden smDown>
        <Drawer className="desktop menu" variant="permanent" open>{menuItems}</Drawer>
      </Hidden>

      <AppBar className="title-bar" position="static">
        <Toolbar>
          <Hidden mdUp>
            <IconButton onClick={openMobileMenu} size="large">
              <FontAwesomeIcon className="menu icon" icon={faBars} />
            </IconButton>
          </Hidden>
          <Typography className="title" align="center" variant="h6">{name}</Typography>
        </Toolbar>
      </AppBar>

      <main onClick={closeMobileMenu}>
        <Routes>
          <Route path={SETTINGS_DEVICE_URL} render={() => <Navigate to={defaultUrl} replace />} />

          {/* Device setting routes */}
          <Route
            path={`${SETTINGS_DEVICE_URL}/hotkeys`}
            render={() => ( <Hotkeys shortcuts={SHORTCUTS} keys={hotkeys} device={device} /> )}
          />
          <Route path={`${SETTINGS_DEVICE_URL}/sources`} render={() => <Sources sources={selectedDeviceSettings.sources} device={device} />} />
          <Route path={`${SETTINGS_DEVICE_URL}/*`} render={() => <DynamicOptions device={device} group={group} />} />

          {/* Server setting routes */}
          <Route
            path={SETTINGS_ABOUT_URL}
            render={() => <About connected={Object.keys( settings ).length - 1} />}
          />
          <Route path={`${SETTINGS_SERVER_URL}/*`} render={() => <DynamicOptions device="global" group={group} />} />

          {/* Tool Routes */}
          <Route path={`${SETTINGS_TOOLS_URL}/overlay`} component={OverlaySettings} />
          <Route path={`${SETTINGS_TOOLS_URL}/closedCaptions`} component={ClosedCaptionSettings} />
          <Route path={`${SETTINGS_TOOLS_URL}/*`} render={() => <DynamicOptions device="global" group={group} />} />

          <Route render={() => <Navigate to={defaultUrl} replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default withErrorFallback( Settings )
