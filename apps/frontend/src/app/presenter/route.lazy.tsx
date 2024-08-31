import './route.css'

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CssBaseline } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { createLazyFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import classNames from 'classnames'
import { lazy, Suspense, useContext, useRef, useState } from 'react'
import { EventsType, useIdleTimer } from 'react-idle-timer'

import CopyHotkeys from '~/components/CopyHotkeys'
import { withErrorFallback } from '~/components/ErrorFallback'
import GlobalHotKeys from '~/components/GlobalHotKeys'
import Loader from '~/components/Loader'
import NavigatorHotKeys from '~/components/NavigatorHotkeys'
import ThemeLoader from '~/components/ThemeLoader'
import { isDesktop } from '~/helpers/consts'
import { SettingsContext } from '~/helpers/contexts'
import { toggleFullscreen } from '~/helpers/electron-utils'
import { GLOBAL_SHORTCUTS } from '~/helpers/keyMap'
import { CLIENT_OPTIONS } from '~/helpers/options'
import { useCurrentLines } from '~/hooks'
import { useNavigateUtils } from '~/hooks/navigate'
import controller from '~/services/controller'

import StatusToast from './-components/StatusToast'
import { ControllerLocationHistoryProvider } from './-controller-location-history'
import { Route as PresenterRoute } from './route'

const Display = lazy( () => import( './-components/Display' ) )

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
  const { open } = useNavigateUtils()
  const navigate = PresenterRoute.useNavigate()
  const pathname = useLocation( { select: ( l ) => l.pathname } )
  const { controllerOnly } = PresenterRoute.useSearch()

  const isControllerOpen = pathname.includes( '/presenter/controller' )

  const [ isIdle, setIsIdle ] = useState( false )

  useIdleTimer( {
    timeout: IDLE_TIMEOUT,
    events: IDLE_EVENTS,
    disabled: !isDesktop,
    onIdle: () => setIsIdle( true ),
    onActive: () => setIsIdle( false ),
  } )

  const lines = useCurrentLines()

  const { local: localSettings } = useContext( SettingsContext )
  const {
    theme: { themeName },
    layout: { controllerZoom: zoom },
    hotkeys,
  } = localSettings

  const toggleController = () => void navigate( { to: isControllerOpen ? '/' : '/presenter/controller' } )

  const { controllerZoom } = CLIENT_OPTIONS
  const setZoom = ( controllerZoom: number ) => controller.setSettings( {
    layout: { controllerZoom },
  } )

  const zoomInController = () => setZoom( Math.min( controllerZoom.max, zoom + 0.1 ) )
  const zoomOutController = () => setZoom( Math.max( controllerZoom.min, zoom - 0.1 ) )
  const zoomResetController = () => setZoom( 1 )

  const toggleFullscreenController = () => {
    void navigate( {
      ...( !pathname.includes( '/presenter/controller' ) && { pathname: '/presenter/controller' } ),
      search: ( s ) => ( { controllerOnly: !s.controllerOnly } ),
    } )
  }

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
    [ GLOBAL_SHORTCUTS.newController.name ]: () => {
      open( {
        search: ( s ) => ( { ...s, controllerOnly: true } ),
      } )
    },
    [ GLOBAL_SHORTCUTS.settings.name ]: () => {
      open( { to: '/settings' } )
    },
    [ GLOBAL_SHORTCUTS.search.name ]: () => void navigate( { to: '/presenter/controller/search' } ),
    [ GLOBAL_SHORTCUTS.history.name ]: () => void navigate( { to: '/presenter/controller/history' } ),
    [ GLOBAL_SHORTCUTS.bookmarks.name ]: () => void navigate( { to: '/presenter/controller/bookmarks' } ),
    [ GLOBAL_SHORTCUTS.navigator.name ]: () => lines.length && void navigate( { to: '/presenter/controller/navigator' } ),
    [ GLOBAL_SHORTCUTS.clearDisplay.name ]: controller.clear,
    [ GLOBAL_SHORTCUTS.toggleFullscreenController.name ]: toggleFullscreenController,
    [ GLOBAL_SHORTCUTS.toggleFullscreen.name ]: toggleFullscreen,
    [ GLOBAL_SHORTCUTS.quit.name ]: window.close,
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

              <ControllerLocationHistoryProvider>
                <Outlet />
              </ControllerLocationHistoryProvider>
            </div>

          </CopyHotkeys>
        </NavigatorHotKeys>
      </GlobalHotKeys>

      <StatusToast />
    </div>
  )
}

export const Route = createLazyFileRoute( '/presenter' )( {
  component: withErrorFallback( Presenter ),
} )
