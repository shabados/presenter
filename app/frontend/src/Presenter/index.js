import React, { lazy, Suspense, useState, useContext, useRef } from 'react'
import { useMount } from 'react-use'
import { hot } from 'react-hot-loader/root'
import { GlobalHotKeys } from 'react-hotkeys'
import { Route, useHistory, useLocation } from 'react-router-dom'
import IdleTimer from 'react-idle-timer'
import queryString from 'qs'
import classNames from 'classnames'

import CssBaseline from '@material-ui/core/CssBaseline'
import IconButton from '@material-ui/core/IconButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus } from '@fortawesome/free-solid-svg-icons'

import controller from '../lib/controller'
import { getUrlState, mapPlatformKeys } from '../lib/utils'
import { toggleFullscreen } from '../lib/electron-utils'
import {
  CONTROLLER_URL,
  SEARCH_URL,
  HISTORY_URL,
  NAVIGATOR_URL,
  BOOKMARKS_URL,
  SETTINGS_URL,
  STATES,
  isMobile,
  IDLE_TIMEOUT,
  isDesktop,
} from '../lib/consts'
import { GLOBAL_SHORTCUTS } from '../lib/keyMap'
import { SettingsContext } from '../lib/contexts'

import ThemeLoader from '../shared/ThemeLoader'
import Loader from '../shared/Loader'
import NavigatorHotKeys from '../shared/NavigatorHotkeys'
import { withErrorFallback } from '../shared/ErrorFallback'
import CopyHotkeys from '../shared/CopyHotkeys'

import StatusToast from './StatusToast'

import './index.css'

const Display = lazy( () => import( './Display' ) )
const Controller = lazy( () => import( '../Controller' ) )

const DEFAULT_IDLE_EVENTS = [
  'mousemove',
  'wheel',
  'DOMMouseScroll',
  'mouseWheel',
  'mousedown',
  'touchstart',
  'touchmove',
  'MSPointerDown',
  'MSPointerMove',
]

const Presenter = () => {
  const history = useHistory()
  const location = useLocation()
  const { search, pathname } = location
  const { controllerOnly } = getUrlState( search )

  const [ idle, setIdle ] = useState( false )

  const onIdle = () => setIdle( true )
  const onActive = () => setIdle( false )

  const isControllerOpen = pathname.includes( CONTROLLER_URL )

  /**
   * Sets the query string parameters, retaining any currently present.
   * @param params The query string parameters.
   */
  const setQueryParams = params => history.push( {
    ...location,
    search: queryString.stringify( { ...getUrlState( search ), ...params } ),
  } )

  /**
   * More concise form to navigate to URLs, retaining query params.
   * @param pathname The path to navigate to.
   */
  const go = pathname => history.push( { ...location, pathname } )

  /**
   * Toggles the controller.
   */
  const toggleController = () => {
    const nextURL = pathname.includes( CONTROLLER_URL ) ? '/' : CONTROLLER_URL
    go( nextURL )
  }

  /**
   * Always puts the controller in fullscreen.
   */
  const setFullscreenController = () => history.push( {
    pathname: CONTROLLER_URL,
    search: queryString.stringify( { [ STATES.controllerOnly ]: true } ),
  } )

  /**
   * Toggles the given query string parameter.
   * @param query The query string parameter to toggle.
   */
  const toggleQuery = query => {
    const parsed = getUrlState( search )

    setQueryParams( {
      ...parsed,
      [ query ]: parsed[ query ] ? undefined : true,
    } )
  }

  /**
   * Toggles the controller in fullscreen.
   */
  const toggleFullscreenController = () => {
    // Navigates to the controller first, if not there
    if ( !pathname.includes( CONTROLLER_URL ) ) toggleController()

    toggleQuery( STATES.controllerOnly )
  }

  /**
   * Prevents the default action from occurring for each handler.
   * @param events An object containing the event names and corresponding handlers.
   */
  const preventDefault = events => Object.entries( events )
    .reduce( ( events, [ name, handler ] ) => ( {
      ...events,
      [ name ]: event => event.preventDefault() || handler( event ),
    } ), {} )

  // Global Hotkey Handlers
  const hotkeyHandlers = preventDefault( {
    [ GLOBAL_SHORTCUTS.toggleController.name ]: toggleController,
    [ GLOBAL_SHORTCUTS.newController.name ]: () => controller.openWindow( `${CONTROLLER_URL}?${STATES.controllerOnly}=true`, { alwaysOnTop: true } ),
    [ GLOBAL_SHORTCUTS.settings.name ]: () => controller.openWindow( SETTINGS_URL ),
    [ GLOBAL_SHORTCUTS.search.name ]: () => go( SEARCH_URL ),
    [ GLOBAL_SHORTCUTS.history.name ]: () => go( HISTORY_URL ),
    [ GLOBAL_SHORTCUTS.bookmarks.name ]: () => go( BOOKMARKS_URL ),
    [ GLOBAL_SHORTCUTS.navigator.name ]: () => go( NAVIGATOR_URL ),
    [ GLOBAL_SHORTCUTS.clearDisplay.name ]: controller.clear,
    [ GLOBAL_SHORTCUTS.toggleFullscreenController.name ]: toggleFullscreenController,
    [ GLOBAL_SHORTCUTS.toggleFullscreen.name ]: toggleFullscreen,
    [ GLOBAL_SHORTCUTS.quit.name ]: window.close,
  } )

  useMount( () => {
    if ( isMobile ) setFullscreenController()
  } )

  const { local: localSettings } = useContext( SettingsContext )
  const { theme: { themeName }, hotkeys } = localSettings

  // Required for mouse shortcuts
  const presenterRef = useRef( null )

  return (
    <div ref={presenterRef} className={classNames( { idle }, 'presenter' )}>
      <CssBaseline />
      <ThemeLoader name={themeName} />

      {isDesktop && (
        <IdleTimer
          events={DEFAULT_IDLE_EVENTS}
          onIdle={onIdle}
          onActive={onActive}
          timeout={IDLE_TIMEOUT}
        />
      )}

      <GlobalHotKeys keyMap={mapPlatformKeys( hotkeys )} handlers={hotkeyHandlers}>
        <NavigatorHotKeys active={!isControllerOpen} mouseTargetRef={presenterRef}>
          <CopyHotkeys>


            <Suspense fallback={<Loader />}>
              {!controllerOnly && <Display settings={localSettings} />}
            </Suspense>

            <div className={classNames( 'controller-container', { fullscreen: controllerOnly } )}>
              <IconButton className="expand-icon" onClick={toggleController}>
                <FontAwesomeIcon icon={faPlus} />
              </IconButton>

              <Route path={CONTROLLER_URL}>
                {() => <Controller />}
              </Route>
            </div>

          </CopyHotkeys>
        </NavigatorHotKeys>
      </GlobalHotKeys>

      <StatusToast />
    </div>
  )
}

export default hot( withErrorFallback( Presenter ) )
