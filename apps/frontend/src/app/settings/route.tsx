/* eslint-disable
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-noninteractive-element-interactions
*/
import './route.css'

import { IconProp } from '@fortawesome/fontawesome-svg-core'
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
import { createFileRoute, Link, Outlet, ToOptions, useLocation } from '@tanstack/react-router'
import classNames from 'classnames'
import { Fragment, useContext, useEffect, useState } from 'react'

import { withErrorFallback } from '~/components/ErrorFallback'
import ThemeLoader from '~/components/ThemeLoader'
import { SettingsContext } from '~/helpers/contexts'
import { FLAT_OPTION_GROUPS, OPTION_GROUPS } from '~/helpers/options'

type ItemProps = {
  name: string,
  icon: IconProp,
  selected?: boolean,
  url: string,
  onClick?: () => any,
}

const Item = ( { name, icon, selected = false, url = '/settings', onClick }: ItemProps ) => (
  <Link to={url} onClick={onClick}>
    <ListItem disableRipple selected={selected} className="item" key={name} button>
      <ListItemIcon>
        <FontAwesomeIcon className="icon" icon={icon} />
      </ListItemIcon>
      <ListItemText className="text" primary={name} />
    </ListItem>
  </Link>
)

const Settings = () => {
  const pathname = useLocation( { select: ( l ) => l.pathname } )
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

  const openMobileMenu = () => setMobileOpen( true )
  const closeMobileMenu = () => setMobileOpen( false )

  const menu = [
    [ null, OPTION_GROUPS.none, selectedDeviceSettings, '/settings/client' ],
    [ 'Activities', OPTION_GROUPS.activities, selectedDeviceSettings, '/settings/client' ],
    [ 'Server', OPTION_GROUPS.server, settings.global, '/settings/server' ],
    [ 'Tools', OPTION_GROUPS.tools, settings.global, '/settings/tools' ],
  ] satisfies [string | null, typeof OPTION_GROUPS[keyof typeof OPTION_GROUPS], typeof selectedDeviceSettings, ToOptions['to']][]

  const menuItems = (
    <List className="content">
      <Select
        className="select-menu device-selector category-title"
        onChange={( { target: { value } } ) => setDevice( value )}
        value={device}
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
        <Fragment key={sectionName}>
          {sectionName && <Typography key={sectionName} className="category-title">{sectionName}</Typography>}

          {settingsGroup && Object.keys( settingsGroup )
            .map( ( name ) => (
              <Item
                key={name}
                selected={name === group}
                {...settingsGroup[ name ]}
                url={`${url}/${name}`}
                onClick={closeMobileMenu}
              />
            ) ) }
        </Fragment>
      ) ) }
    </List>
  )

  const { theme: { simpleGraphics } } = settings.local
  const { theme: { themeName = '' } = {} } = selectedDeviceSettings

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
        <Outlet />
      </main>
    </div>
  )
}

export const Route = createFileRoute( '/settings' )( {
  component: withErrorFallback( Settings ),
} )
