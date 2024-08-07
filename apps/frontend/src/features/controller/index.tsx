import './index.css'

import { faStar } from '@fortawesome/free-regular-svg-icons'
import {
  faCog,
  faHistory,
  faMap,
  faSearch,
  faSignOutAlt,
  faVideoSlash,
  faWindowMaximize,
  faWindowMinimize,
} from '@fortawesome/free-solid-svg-icons'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import classNames from 'classnames'
import queryString from 'qs'
import { useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import {
  BOOKMARKS_URL,
  CONTROLLER_URL,
  HISTORY_URL,
  NAVIGATOR_URL,
  PRESENTER_URL,
  SEARCH_URL,
  SETTINGS_URL,
  STATES,
} from '../lib/consts'
import { ContentContext, SettingsContext } from '../lib/contexts'
import controller from '../lib/controller'
import { useCurrentLines, useEffectOnce, usePrevious } from '../lib/hooks'
import { getUrlState } from '../lib/utils'
import Bookmarks from './Bookmarks'
import History from './History'
import Navigator, { Bar as NavigatorBar } from './Navigator'
import Search from './Search'
import ToolbarButton from './ToolbarButton'

type OnHover = ( message: string | null ) => Record<string, any>

type TopBarProps = {
  title?: string,
  onHover?: OnHover,
}

/**
 * Renders the top navigation bar, showing the current path in the URL, and the hover state.
 * @param title The title text in the top bar.
 * @param onHover Fired on hover with name.
 */
const TopBar = ( { title = '', onHover = () => ( {} ) }: TopBarProps ) => {
  const resetHover = () => onHover( null )

  const location = useLocation()
  const { search, pathname } = location
  const navigate = useNavigate()

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
        onClick={() => navigate( PRESENTER_URL )}
        onMouseEnter={() => onHover( 'Hide Controller' )}
        onMouseLeave={resetHover}
      />
      {state[ STATES.controllerOnly ] ? (
        <ToolbarButton
          name="Minimize Controller"
          icon={faWindowMaximize}
          flip="vertical"
          onClick={() => navigate( {
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
          onClick={() => navigate( {
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
          navigate( PRESENTER_URL )
        }}
        onMouseEnter={() => onHover( 'Pop Out Controller' )}
        onMouseLeave={resetHover}
      />
    </Toolbar>
  )
}

type BottomBarProps = {
  onHover?: OnHover,
  renderContent?: () => any,
}

/**
 * Renders the bottom navigation bar.
 * @param history A `history` object.
 * @param renderContent A render prop for content in the bottom bar.
 * @param location A `location` object.
 * @param onHover Fired on hover with name.
 */
const BottomBar = ( { renderContent = () => null, onHover = () => ( {} ) }: BottomBarProps ) => {
  const navigate = useNavigate()
  const location = useLocation()

  const lines = useCurrentLines()

  const go = ( pathname: string ) => () => navigate( { ...location, pathname } )
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

/**
 * Controller controls the display and configures settings.
 */
const Controller = ( props ) => {
  const { shabad, bani } = useContext( ContentContext )
  const lines = useCurrentLines()

  const previousLines = usePrevious( lines )

  const [ hovered, setHovered ] = useState( null )

  const location = useLocation()
  const { search } = location

  const navigate = useNavigate()

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

    if ( isTransition && redirects.some( ( route ) => pathname.includes( route ) ) ) {
      navigate( { ...location, pathname: NAVIGATOR_URL } )
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
    <Routes key={( shabad || bani || {} ).id}>
      {routes.map( ( [ route, Component, BarComponent ] ) => (
        <Route
          key={route}
          path={route}
          element={(
            <div className={classNames( { simple }, 'controller' )}>
              <TopBar
                title={hovered || route.split( '/' ).pop()}
                onHover={setHovered}
              />

              <div className="content">
                <Component />
              </div>

              <BottomBar
                {...props}
                onHover={setHovered}
                renderContent={() => BarComponent && (
                  <BarComponent
                    {...props}
                    onHover={setHovered}
                  />
                )}
              />
            </div>
          )}
        />
      ) )}

      <Route element={<Navigate to={lastUrl} replace />} />
    </Routes>
  )
}

export default Controller
