/* eslint-disable
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-noninteractive-element-interactions
*/
import React, { useState, useEffect, useContext } from 'react'
import { string, bool, shape } from 'prop-types'
import { Redirect, Link, Switch, Route, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import {
  BACKEND_URL,
  SETTINGS_URL,
  SETTINGS_DEVICE_URL,
  SETTINGS_SERVER_URL,
  SETTINGS_ABOUT_URL,
  SETTINGS_TOOLS_URL,
} from '../../lib/consts'
import { OPTIONS, OPTION_GROUPS, FLAT_OPTION_GROUPS } from '../../lib/options'
import SHORTCUTS from '../../lib/keyMap'
import { SettingsContext } from '../../lib/contexts'

import ThemeLoader from '../../components/ThemeLoader'
import { withErrorFallback } from '../../components/ErrorFallback'

import Sources from './Sources'
import About from './About'
import Hotkeys from './Hotkeys'
import OverlaySettings from './OverlaySettings'
import ClosedCaptionSettings from './ClosedCaptionSettings'
import DynamicOptions from './DynamicOptions'

import './index.css'

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

  useEffect( () => {
    fetch( `${BACKEND_URL}/presenter/themes` )
      .then( res => res.json() )
      .then( themes => {
        OPTIONS.themeName.values = themes.map( theme => ( { name: theme, value: theme } ) )
      } )
  }, [] )

  const openMobileMenu = () => setMobileOpen( true )
  const closeMobileMenu = () => setMobileOpen( false )

  const renderMenuItems = () => {
    const Item = ( { name, icon, selected, url = SETTINGS_URL } ) => (
      <Link to={url} onClick={closeMobileMenu}>
        <li className={classNames( 'item', { selected } )} key={name}>
          <span className="icon-container">
            <FontAwesomeIcon className="icon" icon={icon} />
          </span>
          <span className="text">{name}</span>
        </li>
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

    const menuItems = [
      [ null, OPTION_GROUPS.none, selectedDeviceSettings, SETTINGS_DEVICE_URL ],
      [ 'Activities', OPTION_GROUPS.activities, selectedDeviceSettings, SETTINGS_DEVICE_URL ],
      [ 'Server', OPTION_GROUPS.server, settings.global, SETTINGS_SERVER_URL ],
      [ 'Tools', OPTION_GROUPS.tools, settings.global, SETTINGS_TOOLS_URL ],
    ]

    return (
      <ul className="content">
        <select
          className="select-menu device-selector category-title"
          onChange={( { target: { value } } ) => setDevice( value )}
          value={device}
        >
          <option value="local">This Device</option>
          {Object.keys( settings )
            .filter( name => ![ 'local', 'global' ].includes( name ) )
            .map( device => (
              <option key={device} value={device}>{device}</option>
            ) )}
        </select>

        {menuItems.map( ( [ sectionName, settingsGroup, , url ] ) => (
          <>

            {sectionName && <span key={sectionName} className="category-title">{sectionName}</span>}

            {Object.keys( settingsGroup )
              .map( name => (
                <Item
                  key={name}
                  selected={name === group}
                  {...settingsGroup[ name ]}
                  url={`${url}/${name}`}
                />
              ) ) }

          </>
        ) ) }
      </ul>
    )
  }

  const renderMenu = () => (
    <>
      <nav className={classNames( 'mobile menu', { open: mobileOpen } )}>
        {renderMenuItems()}
      </nav>

      <nav className="desktop menu">
        {renderMenuItems()}
      </nav>
    </>
  )

  const renderTitlebar = () => (
    <header className="title-bar">
      <div className="toolbar">
        <button type="button" className="menu-toggle" onClick={openMobileMenu}>
          <FontAwesomeIcon className="menu icon" icon={faBars} />
        </button>
        <h6 className="title">{name}</h6>
      </div>
    </header>
  )

  const { theme: { simpleGraphics } } = settings.local
  const { theme: { themeName } = {}, hotkeys } = selectedDeviceSettings

  const defaultUrl = `${SETTINGS_DEVICE_URL}/${Object.keys( selectedDeviceSettings )[ 0 ]}`

  return (
    <div className={classNames( { simple: simpleGraphics }, 'settings' )}>
      <ThemeLoader name={themeName} />

      {renderMenu()}
      {renderTitlebar()}

      <main onClick={closeMobileMenu}>
        <Switch>
          <Redirect exact from={SETTINGS_DEVICE_URL} to={defaultUrl} />

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

          <Redirect to={defaultUrl} />
        </Switch>
      </main>
    </div>
  )
}

export default withErrorFallback( Settings )
