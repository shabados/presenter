import React, { useState, useEffect, useContext, useRef } from 'react'
import { Route, Switch, Redirect, useLocation, useHistory } from 'react-router-dom'
import { string, func } from 'prop-types'

import classNames from 'classnames'
import queryString from 'qs'

import {
  faCog,
  faHistory,
  faMap,
  faSearch,
  faSignOutAlt,
  faVideoSlash,
  faWindowMinimize,
  faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'

import controller from '../../lib/controller'
import {
  BOOKMARKS_URL,
  CONTROLLER_URL,
  HISTORY_URL,
  NAVIGATOR_URL,
  SEARCH_URL,
  SETTINGS_URL,
  STATES,
  PRESENTER_URL,
} from '../../lib/consts'
import { getUrlState } from '../../lib/utils'
import { ContentContext, SettingsContext } from '../../lib/contexts'
import { useCurrentLines } from '../../lib/hooks'

import ToolbarButton from './ToolbarButton'
import Search from './Search'
import Navigator, { Bar as NavigatorBar } from './Navigator'
import History from './History'
import Bookmarks from './Bookmarks'

import './index.css'

const TopBar = ( { title, onHover } ) => {
  const resetHover = () => onHover( null )

  const location = useLocation()
  const { search, pathname } = location
  const history = useHistory()

  const state = getUrlState( search )

  return (
    <div className="top bar">
      <ToolbarButton
        name="Settings"
        icon={faCog}
        onClick={() => controller.openWindow( SETTINGS_URL )}
        onMouseEnter={() => onHover( 'Settings' )}
        onMouseLeave={resetHover}
      />
      <span className="name">{title}</span>
      <ToolbarButton
        name="Minimize"
        icon={faWindowMinimize}
        onClick={() => history.push( PRESENTER_URL )}
        onMouseEnter={() => onHover( 'Hide Controller' )}
        onMouseLeave={resetHover}
      />
      {state[ STATES.controllerOnly ] ? (
        <ToolbarButton
          name="Minimize Controller"
          icon={faWindowMaximize}
          flip="vertical"
          onClick={() => history.push( {
            ...location,
            search: queryString.stringify( { ...state, [ STATES.controllerOnly ]: undefined } ),
          } )}
          onMouseEnter={() => onHover( 'Minimize Controller' )}
          onMouseLeave={resetHover}
        />
      ) : (
        <ToolbarButton
          name="Maximize Controller"
          icon={faWindowMaximize}
          onClick={() => history.push( {
            ...location,
            search: queryString.stringify( { ...state, [ STATES.controllerOnly ]: true } ),
          } )}
          onMouseLeave={resetHover}
        />
      )}
      <ToolbarButton
        name="Pop Out"
        icon={faSignOutAlt}
        onClick={() => {
          const popOutQuery = queryString.stringify( { ...state, [ STATES.controllerOnly ]: true } )

          controller.openWindow( `${pathname}?${popOutQuery}`, { alwaysOnTop: true } )
          history.push( PRESENTER_URL )
        }}
        onMouseEnter={() => onHover( 'Pop Out Controller' )}
        onMouseLeave={resetHover}
      />
    </div>
  )
}

TopBar.propTypes = {
  title: string,
  onHover: func,
}

TopBar.defaultProps = {
  title: '',
  onHover: () => {},
}

const BottomBar = ( { renderContent, onHover } ) => {
  const history = useHistory()
  const location = useLocation()

  const lines = useCurrentLines()

  const go = pathname => () => history.push( { ...location, pathname } )
  const resetHover = () => onHover( null )

  return (
    <div className="bottom bar">
      <ToolbarButton name="Search" icon={faSearch} onClick={go( SEARCH_URL )} onHover={onHover} />
      <ToolbarButton
        name="History"
        icon={faHistory}
        onClick={go( HISTORY_URL )}
        onMouseEnter={() => onHover( 'History' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="Bookmarks"
        icon={faStar}
        onClick={go( BOOKMARKS_URL )}
        onMouseEnter={() => onHover( 'Bookmarks' )}
        onMouseLeave={resetHover}
      />
      <div className="middle">{renderContent()}</div>
      {!!lines.length && (
      <ToolbarButton
        name="Navigator"
        icon={faMap}
        onClick={go( NAVIGATOR_URL )}
        onMouseEnter={() => onHover( 'Navigator' )}
        onMouseLeave={resetHover}
      />
      )}
      <ToolbarButton
        name="Clear"
        icon={faVideoSlash}
        onClick={controller.clear}
        onMouseEnter={() => onHover( 'Clear' )}
        onMouseLeave={resetHover}
      />
    </div>
  )
}

BottomBar.propTypes = {
  onHover: func,
  renderContent: func,
}

BottomBar.defaultProps = {
  onHover: () => {},
  renderContent: () => null,
}

const Controller = props => {
  const { shabad, bani } = useContext( ContentContext )
  const lines = useCurrentLines()

  const previousLinesRef = useRef( lines )
  const previousLines = previousLinesRef.current
  useEffect( () => { previousLinesRef.current = lines } )

  const [ hovered, setHovered ] = useState( null )

  const location = useLocation()
  const { search } = location

  const history = useHistory()

  const [ lastUrl, setLastUrl ] = useState( `${NAVIGATOR_URL}${search}` )

  useEffect( () => history.listen( ( { pathname, search } ) => {
    if ( pathname.match( `${CONTROLLER_URL}/.*` ) ) setLastUrl( `${pathname}${search}` )
  } ), [] )

  useEffect( () => {
    const { pathname } = location
    const redirects = [ SEARCH_URL, HISTORY_URL, BOOKMARKS_URL ]

    const isTransition = lines.length && lines !== previousLines

    if ( isTransition && redirects.some( route => pathname.includes( route ) ) ) {
      history.push( { ...location, pathname: NAVIGATOR_URL } )
    }
  }, [ history, lines, previousLines, location ] )

  const settings = useContext( SettingsContext )
  const { local: { theme: { simpleGraphics: simple } } } = settings

  const routes = [
    [ SEARCH_URL, Search ],
    [ NAVIGATOR_URL, Navigator, NavigatorBar ],
    [ HISTORY_URL, History ],
    [ BOOKMARKS_URL, Bookmarks ],
  ]

  return (
    <Switch key={( shabad || bani || {} ).id}>
      {routes.map( ( [ route, Component, BarComponent ] ) => (
        <Route
          key={route}
          path={route}
          render={routerProps => (
            <div className={classNames( { simple }, 'controller' )}>
              <TopBar
                {...routerProps}
                title={hovered || route.split( '/' ).pop()}
                onHover={setHovered}
              />

              <div className="content">
                <Component {...routerProps} />
              </div>

              <BottomBar
                {...props}
                {...routerProps}
                onHover={setHovered}
                renderContent={() => BarComponent && (
                <BarComponent
                  {...props}
                  {...routerProps}
                  onHover={setHovered}
                />
                )}
              />
            </div>
          )}
        />
      ) )}

      <Redirect to={lastUrl} />
    </Switch>
  )
}

export default Controller
