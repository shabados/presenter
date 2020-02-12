import React, { useState, useEffect, useContext } from 'react'
import { useEffectOnce, usePrevious } from 'react-use'
import { hot } from 'react-hot-loader/root'
import { Route, Switch, Redirect, useLocation, useHistory } from 'react-router-dom'
import { string, func } from 'prop-types'

import classNames from 'classnames'
import queryString from 'qs'

import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

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

import controller from '../lib/controller'
import {
  BOOKMARKS_URL,
  CONTROLLER_URL,
  HISTORY_URL,
  NAVIGATOR_URL,
  SEARCH_URL,
  SETTINGS_URL,
  STATES,
  PRESENTER_URL,
} from '../lib/consts'
import { getUrlState } from '../lib/utils'
import { ContentContext, SettingsContext } from '../lib/contexts'
import { useCurrentLines } from '../lib/hooks'

import ToolbarButton from './ToolbarButton'
import Search from './Search'
import Navigator, { Bar as NavigatorBar } from './Navigator'
import History from './History'
import Bookmarks from './Bookmarks'

import './index.css'

/**
 * Renders the top navigation bar, showing the current path in the URL, and the hover state.
 * @param title The title text in the top bar.
 * @param onHover Fired on hover with name.
 */
const TopBar = ( { title, onHover } ) => {
  const resetHover = () => onHover( null )

  const location = useLocation()
  const { search, pathname } = location
  const history = useHistory()

  const state = getUrlState( search )

  return (
    <Toolbar className="top bar">
      <ToolbarButton
        name="Settings"
        icon={faCog}
        onClick={() => controller.openWindow( SETTINGS_URL )}
        onMouseEnter={() => onHover( 'Settings' )}
        onMouseLeave={resetHover}
      />
      <Typography className="name" type="title">{title}</Typography>
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
    </Toolbar>
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

/**
 * Renders the bottom navigation bar.
 * @param history A `history` object.
 * @param renderContent A render prop for content in the bottom bar.
 * @param location A `location` object.
 * @param onHover Fired on hover with name.
 */
const BottomBar = ( { renderContent, onHover } ) => {
  const history = useHistory()
  const location = useLocation()

  const lines = useCurrentLines()

  const go = pathname => () => history.push( { ...location, pathname } )
  const resetHover = () => onHover( null )

  return (
    <Toolbar className="bottom bar">
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
    </Toolbar>
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

/**
 * Controller controls the display and configures settings.
 */
const Controller = props => {
  const { shabad, bani } = useContext( ContentContext )
  const lines = useCurrentLines()

  const previousLines = usePrevious( lines )

  const [ hovered, setHovered ] = useState( null )

  const location = useLocation()
  const { search } = location

  const history = useHistory()

  const [ lastUrl, setLastUrl ] = useState( `${NAVIGATOR_URL}${search}` )

  // Save navigation to any subroutes by listening to history
  useEffectOnce( () => history.listen( ( { pathname, search } ) => {
    if ( pathname.match( `${CONTROLLER_URL}/.*` ) ) setLastUrl( `${pathname}${search}` )
  } ) )

  useEffect( () => {
    const { pathname } = location
    const redirects = [ SEARCH_URL, HISTORY_URL, BOOKMARKS_URL ]

    // Redirect to navigator tab if on one of the redirectable pages
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

export default hot( Controller )
