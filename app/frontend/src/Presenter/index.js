import React, { Component, lazy, Suspense } from 'react'
import { shape, string } from 'prop-types'
import { hot } from 'react-hot-loader/root'
import { location } from 'react-router-prop-types'
import { GlobalHotKeys } from 'react-hotkeys'
import { Route } from 'react-router-dom'
import IdleTimer from 'react-idle-timer'
import queryString from 'qs'
import classNames from 'classnames'

import CssBaseline from '@material-ui/core/CssBaseline'
import IconButton from '@material-ui/core/IconButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus } from '@fortawesome/free-solid-svg-icons'

import controller from '../lib/controller'
import { getUrlState, mapPlatformKeys } from '../lib/utils'
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
} from '../lib/consts'
import { GLOBAL_SHORTCUTS } from '../lib/keyMap'

import ThemeLoader from '../shared/ThemeLoader'
import Loader from '../shared/Loader'
import NavigatorHotKeys from '../shared/NavigatorHotkeys'
import { withErrorFallback } from '../shared/ErrorFallback'

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

class Presenter extends Component {
  state = { idle: false }

  componentDidMount() {
    if ( isMobile ) this.setFullscreenController()
  }

  onIdle = () => this.setState( { idle: true } )

  onActive = () => this.setState( { idle: false } )

  /**
   * Sets the query string parameters, retaining any currently present.
   * @param params The query string parameters.
   */
  setQueryParams = params => {
    const { history, location } = this.props
    const { search } = location

    const previousSearch = getUrlState( search )
    history.push( {
      ...location,
      search: queryString.stringify( { ...previousSearch, ...params } ),
    } )
  }

  /**
   * More concise form to navigate to URLs, retaining query params.
   * @param pathname The path to navigate to.
   */
  go = pathname => {
    const { history, location } = this.props

    history.push( { ...location, pathname } )
  }

  /**
   * Toggles the controller.
   */
  toggleController = () => {
    const { location: { pathname } } = this.props

    const nextURL = pathname.includes( CONTROLLER_URL ) ? '/' : CONTROLLER_URL
    this.go( nextURL )
  }

  /**
   * Always puts the controller in fullscreen.
   */
  setFullscreenController = () => {
    const { history } = this.props

    history.push( {
      pathname: CONTROLLER_URL,
      search: queryString.stringify( { [ STATES.controllerOnly ]: true } ),
    } )
  }

  /**
   * Toggles the controller in fullscreen.
   */
  toggleFullscreenController = () => {
    const { location: { pathname } } = this.props

    // Navigates to the controller first, if not there
    if ( !pathname.includes( CONTROLLER_URL ) ) {
      this.toggleController()
    }

    this.toggleQuery( STATES.controllerOnly )
  }

  /**
   * Toggles presenter fullscreen.
   */
  toggleFullscreen = () => ( !document.webkitFullscreenElement
    ? document.documentElement.webkitRequestFullScreen()
    : document.webkitExitFullscreen()
  )

  /**
   * Toggles the given query string parameter.
   * @param query The query string parameter to toggle.
   */
  toggleQuery = query => {
    const { location: { search } } = this.props

    const parsed = getUrlState( search )
    this.setQueryParams( {
      ...parsed,
      [ query ]: parsed[ query ] ? undefined : true,
    } )
  }

  /**
   * Prevents the default action from occurring for each handler.
   * @param events An object containing the event names and corresponding handlers.
   */
  preventDefault = events => Object.entries( events )
    .reduce( ( events, [ name, handler ] ) => ( {
      ...events,
      [ name ]: event => event.preventDefault() || handler( event ),
    } ), {} )

  // Global Hotkey Handlers
  hotkeyHandlers = this.preventDefault( {
    [ GLOBAL_SHORTCUTS.toggleController.name ]: this.toggleController,
    [ GLOBAL_SHORTCUTS.newController.name ]: () => window.open( `${CONTROLLER_URL}?${STATES.controllerOnly}=true`, '_blank' ),
    [ GLOBAL_SHORTCUTS.settings.name ]: () => window.open( SETTINGS_URL ),
    [ GLOBAL_SHORTCUTS.search.name ]: () => this.go( SEARCH_URL ),
    [ GLOBAL_SHORTCUTS.history.name ]: () => this.go( HISTORY_URL ),
    [ GLOBAL_SHORTCUTS.bookmarks.name ]: () => this.go( BOOKMARKS_URL ),
    [ GLOBAL_SHORTCUTS.navigator.name ]: () => this.go( NAVIGATOR_URL ),
    [ GLOBAL_SHORTCUTS.clearDisplay.name ]: controller.clear,
    [ GLOBAL_SHORTCUTS.toggleFullscreenController.name ]: this.toggleFullscreenController,
    [ GLOBAL_SHORTCUTS.toggleFullscreen.name ]: this.toggleFullscreen,
    [ GLOBAL_SHORTCUTS.quit.name ]: window.close,
  } )

  render() {
    const { idle } = this.state

    const { settings, location: { search, pathname }, status, connected } = this.props
    const { controllerOnly } = getUrlState( search )

    const { local: localSettings } = settings
    const { theme: { themeName }, hotkeys } = localSettings

    return (
      <div className={classNames( { idle }, 'presenter' )}>
        <CssBaseline />
        <ThemeLoader name={themeName} connected={connected} />

        <IdleTimer
          events={DEFAULT_IDLE_EVENTS}
          onIdle={this.onIdle}
          onActive={this.onActive}
          timeout={IDLE_TIMEOUT}
        />

        <GlobalHotKeys keyMap={mapPlatformKeys( hotkeys )} handlers={this.hotkeyHandlers}>
          <NavigatorHotKeys {...this.props} active={!pathname.includes( CONTROLLER_URL )}>

            <Suspense fallback={<Loader />}>
              {!controllerOnly && <Display {...this.props} settings={localSettings} />}
            </Suspense>

            <div className={classNames( 'controller-container', { fullscreen: controllerOnly } )}>
              <IconButton className="expand-icon" onClick={this.toggleController}>
                <FontAwesomeIcon icon={faPlus} />
              </IconButton>

              <Route path={CONTROLLER_URL}>
                {props => <Controller {...this.props} {...props} />}
              </Route>
            </div>

          </NavigatorHotKeys>
        </GlobalHotKeys>

        <StatusToast status={status} />
      </div>
    )
  }
}

Presenter.propTypes = {
  ...Display.propTypes,
  status: string,
  settings: shape( {
    theme: shape( {
      themeName: string,
    } ),
  } ).isRequired,
  location: location.isRequired,
}

Presenter.defaultProps = {
  ...Display.defaultProps,
  status: null,
}

export default hot( withErrorFallback( Presenter ) )
