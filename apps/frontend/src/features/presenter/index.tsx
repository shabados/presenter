import './index.css'

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import classNames from 'classnames'
import queryString from 'qs'
import { lazy, Suspense, useContext, useRef, useState } from 'react'
import { EventsType, useIdleTimer } from 'react-idle-timer'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import CopyHotkeys from '~/components/CopyHotkeys'
import { withErrorFallback } from '~/components/ErrorFallback'
import GlobalHotKeys from '~/components/GlobalHotKeys'
import Loader from '~/components/Loader'
import NavigatorHotKeys from '~/components/NavigatorHotkeys'
import ThemeLoader from '~/components/ThemeLoader'
import {
  BOOKMARKS_URL,
  CONTROLLER_URL,
  HISTORY_URL,
  isDesktop,
  isMobile,
  NAVIGATOR_URL,
  SEARCH_URL,
  SETTINGS_URL,
  STATES,
} from '~/helpers/consts'
import { SettingsContext } from '~/helpers/contexts'
import { toggleFullscreen } from '~/helpers/electron-utils'
import { GLOBAL_SHORTCUTS } from '~/helpers/keyMap'
import { OPTIONS } from '~/helpers/options'
import { getUrlState } from '~/helpers/utils'
import { useCurrentLines, useMount } from '~/hooks'
import controller from '~/services/controller'

import StatusToast from './StatusToast'

const Display = lazy( () => import( './Display' ) )
const Controller = lazy( () => import( '~/features/controller' ) )

export const IDLE_TIMEOUT = 1000 * 3
const IDLE_EVENTS = [
  'wheel',
  'DOMMouseScroll',
  'mousemove',
  'mousewheel',
  'mousedown',
  'touchstart',
  'touchmove',
  'MSPointerDown',
  'MSPointerMove',
] as const satisfies EventsType[]

const Presenter = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { search, pathname } = location
  const { controllerOnly } = getUrlState( search )

  const [ isIdle, setIsIdle ] = useState( false )

  useIdleTimer( {
    timeout: IDLE_TIMEOUT,
    events: IDLE_EVENTS,
    disabled: !isDesktop,
    onIdle: () => setIsIdle( true ),
    onActive: () => setIsIdle( false ),
  } )

  const lines = useCurrentLines()

  const isControllerOpen = pathname.includes( CONTROLLER_URL )

  const { local: localSettings } = useContext( SettingsContext )
  const {
    theme: { themeName },
    layout: { controllerZoom: zoom },
    hotkeys,
  } = localSettings

  /**
   * Sets the query string parameters, retaining any currently present.
   * @param params The query string parameters.
   */
  const setQueryParams = ( params ) => navigate( {
    ...location,
    search: queryString.stringify( { ...getUrlState( search ), ...params } ),
  } )

  /**
   * More concise form to navigate to URLs, retaining query params.
   * @param pathname The path to navigate to.
   */
  const go = ( pathname ) => navigate( { ...location, pathname } )

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
  const setFullscreenController = () => navigate( {
    pathname: CONTROLLER_URL,
    search: queryString.stringify( { [ STATES.controllerOnly ]: true } ),
  } )

  const { controllerZoom } = OPTIONS
  const setZoom = ( controllerZoom ) => controller.setSettings( { layout: { controllerZoom } } )
  const zoomInController = () => setZoom( Math.min( controllerZoom.max, zoom + 0.1 ) )
  const zoomOutController = () => setZoom( Math.max( controllerZoom.min, zoom - 0.1 ) )
  const zoomResetController = () => setZoom( 1 )

  /**
   * Toggles the given query string parameter.
   * @param query The query string parameter to toggle.
   */
  const toggleQuery = ( query ) => {
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
  const preventDefault = ( events ) => Object.entries( events )
    .reduce( ( events, [ name, handler ] ) => ( {
      ...events,
      [ name ]: ( event ) => event.preventDefault() || handler( event ),
    } ), {} )

  // Global Hotkey Handlers
  const hotkeyHandlers = preventDefault( {
    [ GLOBAL_SHORTCUTS.zoomInController.name ]: zoomInController,
    [ GLOBAL_SHORTCUTS.zoomOutController.name ]: zoomOutController,
    [ GLOBAL_SHORTCUTS.zoomResetController.name ]: zoomResetController,
    [ GLOBAL_SHORTCUTS.toggleController.name ]: toggleController,
    [ GLOBAL_SHORTCUTS.newController.name ]: () => controller.openWindow( `${CONTROLLER_URL}?${STATES.controllerOnly}=true`, { alwaysOnTop: true } ),
    [ GLOBAL_SHORTCUTS.settings.name ]: () => controller.openWindow( SETTINGS_URL ),
    [ GLOBAL_SHORTCUTS.search.name ]: () => go( SEARCH_URL ),
    [ GLOBAL_SHORTCUTS.history.name ]: () => go( HISTORY_URL ),
    [ GLOBAL_SHORTCUTS.bookmarks.name ]: () => go( BOOKMARKS_URL ),
    [ GLOBAL_SHORTCUTS.navigator.name ]: () => lines.length && go( NAVIGATOR_URL ),
    [ GLOBAL_SHORTCUTS.clearDisplay.name ]: controller.clear,
    [ GLOBAL_SHORTCUTS.toggleFullscreenController.name ]: toggleFullscreenController,
    [ GLOBAL_SHORTCUTS.toggleFullscreen.name ]: toggleFullscreen,
    [ GLOBAL_SHORTCUTS.quit.name ]: window.close,
  } )

  useMount( () => {
    if ( isMobile ) setFullscreenController()
  } )

  // Required for mouse shortcuts
  const presenterRef = useRef( null )

  return (
    <div ref={presenterRef} className={classNames( { idle: isIdle }, 'presenter' )}>
      <CssBaseline />
      <ThemeLoader name={themeName} />

      <GlobalHotKeys keyMap={hotkeys} handlers={hotkeyHandlers}>
        <NavigatorHotKeys active={!isControllerOpen} mouseTargetRef={presenterRef}>
          <CopyHotkeys>

            <Suspense fallback={<Loader />}>
              {!( isControllerOpen && controllerOnly ) && <Display settings={localSettings} />}
            </Suspense>

            <div className={classNames( 'controller-container', { fullscreen: controllerOnly } )} style={{ zoom }}>
              <IconButton className="expand-icon" onClick={toggleController} size="large">
                <FontAwesomeIcon icon={faPlus} />
              </IconButton>

              <Routes>
                <Route
                  path={CONTROLLER_URL}
                  element={<Controller />}
                />
              </Routes>
            </div>

          </CopyHotkeys>
        </NavigatorHotKeys>
      </GlobalHotKeys>

      <StatusToast />
    </div>
  )
}

export default withErrorFallback( Presenter )
