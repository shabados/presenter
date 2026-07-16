import React, { lazy, Suspense, useState, useContext, useRef, useEffect } from 'react'
import { Route, useHistory, useLocation } from 'react-router-dom'
import IdleTimer from 'react-idle-timer'
import queryString from 'qs'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus } from '@fortawesome/free-solid-svg-icons'

import controller from '../../lib/controller'
import { getUrlState } from '../../lib/utils'
import { toggleFullscreen } from '../../lib/electron-utils'
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
} from '../../lib/consts'
import { GLOBAL_SHORTCUTS } from '../../lib/keyMap'
import { SettingsContext } from '../../lib/contexts'
import { useCurrentLines } from '../../lib/hooks'
import { OPTIONS } from '../../lib/options'

import ThemeLoader from '../../components/ThemeLoader'
import Loader from '../../components/Loader'
import GlobalHotKeys from '../../hotkeys/GlobalHotKeys'
import NavigatorHotKeys from '../../hotkeys/NavigatorHotkeys'
import { withErrorFallback } from '../../components/ErrorFallback'
import CopyHotkeys from '../../hotkeys/CopyHotkeys'

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

  const lines = useCurrentLines()

  const isControllerOpen = pathname.includes( CONTROLLER_URL )

  const { local: localSettings } = useContext( SettingsContext )
  const {
    theme: { themeName },
    layout: { controllerZoom: zoom },
    hotkeys,
  } = localSettings

  const setQueryParams = params => history.push( {
    ...location,
    search: queryString.stringify( { ...getUrlState( search ), ...params } ),
  } )

  const go = pathname => history.push( { ...location, pathname } )

  const toggleController = () => {
    const nextURL = pathname.includes( CONTROLLER_URL ) ? '/' : CONTROLLER_URL
    go( nextURL )
  }

  const setFullscreenController = () => history.push( {
    pathname: CONTROLLER_URL,
    search: queryString.stringify( { [ STATES.controllerOnly ]: true } ),
  } )

  const { controllerZoom } = OPTIONS
  const setZoom = controllerZoom => controller.setSettings( { layout: { controllerZoom } } )
  const zoomInController = () => setZoom( Math.min( controllerZoom.max, zoom + 0.1 ) )
  const zoomOutController = () => setZoom( Math.max( controllerZoom.min, zoom - 0.1 ) )
  const zoomResetController = () => setZoom( 1 )

  const toggleQuery = query => {
    const parsed = getUrlState( search )

    setQueryParams( {
      ...parsed,
      [ query ]: parsed[ query ] ? undefined : true,
    } )
  }

  const toggleFullscreenController = () => {
    if ( !pathname.includes( CONTROLLER_URL ) ) toggleController()

    toggleQuery( STATES.controllerOnly )
  }

  const preventDefault = events => Object.entries( events )
    .reduce( ( events, [ name, handler ] ) => ( {
      ...events,
      [ name ]: event => event.preventDefault() || handler( event ),
    } ), {} )

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

  useEffect( () => {
    if ( isMobile ) setFullscreenController()
  }, [] )

  const presenterRef = useRef( null )

  return (
    <div ref={presenterRef} className={classNames( { idle }, 'presenter' )}>
      <ThemeLoader name={themeName} />

      {isDesktop && (
        <IdleTimer
          events={DEFAULT_IDLE_EVENTS}
          onIdle={onIdle}
          onActive={onActive}
          timeout={IDLE_TIMEOUT}
        />
      )}

      <GlobalHotKeys keyMap={hotkeys} handlers={hotkeyHandlers}>
        <NavigatorHotKeys active={!isControllerOpen} mouseTargetRef={presenterRef}>
          <CopyHotkeys>

            <Suspense fallback={<Loader />}>
              {!( isControllerOpen && controllerOnly ) && <Display settings={localSettings} />}
            </Suspense>

            <div className={classNames( 'controller-container', { fullscreen: controllerOnly } )} style={{ zoom }}>
              <button type="button" className="expand-icon" onClick={toggleController}>
                <FontAwesomeIcon icon={faPlus} />
              </button>

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

export default withErrorFallback( Presenter )
