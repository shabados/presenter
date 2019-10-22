import React, { Component, lazy, Suspense } from 'react'
import { shape, string } from 'prop-types'
import { hot } from 'react-hot-loader/root'
import { location } from 'react-router-prop-types'
import { GlobalHotKeys } from 'react-hotkeys'
import { Link, Route, Switch } from 'react-router-dom'
import queryString from 'qs'
import classNames from 'classnames'

import CssBaseline from '@material-ui/core/CssBaseline'
import IconButton from '@material-ui/core/IconButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus } from '@fortawesome/free-solid-svg-icons'

import controller from '../lib/controller'
import { getUrlState } from '../lib/utils'
import {
  CONTROLLER_URL,
  MENU_URL,
  SEARCH_URL,
  HISTORY_URL,
  NAVIGATOR_URL,
  BOOKMARKS_URL,
  STATES,
} from '../lib/consts'
import { GLOBAL_SHORTCUTS, NAVIGATOR_SHORTCUTS } from '../lib/keyMap'

import ThemeLoader from '../shared/ThemeLoader'
import Loader from '../shared/Loader'

import StatusToast from './StatusToast'

import './index.css'

const Display = lazy( () => import( './Display' ) )
const Controller = lazy( () => import( '../Controller' ) )

class Presenter extends Component {
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
   * Places the controller in fullscreen.
   */
  fullscreenController = () => {
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

  goNextLine = () => {
    const { shabad, bani, lineId } = this.props
    const { lines } = shabad || bani || {}

    if ( !lines ) return

    const { orderId } = lines.find( ( { id } ) => id === lineId ) || {}

    controller.nextLine( orderId )
  }

  goPreviousLine = () => {
    const { shabad, bani, lineId } = this.props
    const { lines } = shabad || bani || {}

    if ( !lines ) return

    const { orderId } = lines.find( ( { id } ) => id === lineId ) || {}

    controller.previousLine( orderId )
  }

  goFirstLine = () => {
    const { lineId, shabad, bani } = this.props
    const { lines } = shabad || bani || {}

    if ( !lines ) return

    const [ firstLine ] = lines

    // Go to the previous shabad if the first line is highlighted (but not for banis)
    if ( !bani && lineId === firstLine.id ) controller.previousShabad( shabad.orderId )
    else controller.line( firstLine.id )
  }

  goLastLine = () => {
    const { lineId, shabad, bani } = this.props
    const { lines } = shabad || bani || {}

    if ( !lines ) return

    const lastLine = lines[ lines.length - 1 ]

    // Go to the next shabad if the last line is highlighted (but not for banis)
    if ( !bani && lineId === lastLine.id ) controller.nextShabad( shabad.orderId )
    else controller.line( lastLine.id )
  }

  autoToggle = () => {
    const { shabad } = this.props

    //* Only for Shabads
    if ( shabad ) controller.autoToggleShabad( this.props )
  }

  restoreLine = () => {
    const { lineId, viewedLines } = this.props

    const ids = Object
      .entries( viewedLines )
      .sort( ( [ , t1 ], [ , t2 ] ) => new Date( t1 ) - new Date( t2 ) )
      .map( ( [ id ] ) => id )

    if ( lineId || !ids ) return

    controller.line( ids[ ids.length - 1 ] )
  }

  setMainLine = () => {
    const { lineId } = this.props

    if ( lineId ) controller.mainLine( lineId )
  }

  goMainLine = () => {
    const { mainLineId } = this.props

    if ( mainLineId ) controller.line( mainLineId )
  }

  goJumpLine = () => {
    const { nextLineId } = this.props

    if ( nextLineId ) controller.line( nextLineId )
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
  globalHotKeyHandlers = this.preventDefault( {
    [ GLOBAL_SHORTCUTS.toggleController.name ]: this.toggleController,
    [ GLOBAL_SHORTCUTS.newController.name ]: () => window.open( `${CONTROLLER_URL}?${STATES.controllerOnly}=true`, '_blank' ),
    [ GLOBAL_SHORTCUTS.menu.name ]: () => this.go( MENU_URL ),
    [ GLOBAL_SHORTCUTS.search.name ]: () => this.go( SEARCH_URL ),
    [ GLOBAL_SHORTCUTS.history.name ]: () => this.go( HISTORY_URL ),
    [ GLOBAL_SHORTCUTS.bookmarks.name ]: () => this.go( BOOKMARKS_URL ),
    [ GLOBAL_SHORTCUTS.navigator.name ]: () => this.go( NAVIGATOR_URL ),
    [ GLOBAL_SHORTCUTS.clearDisplay.name ]: controller.clear,
    [ GLOBAL_SHORTCUTS.toggleFullscreenController.name ]: this.fullscreenController,
    [ GLOBAL_SHORTCUTS.toggleFullscreen.name ]: this.toggleFullscreen,
    [ GLOBAL_SHORTCUTS.quit.name ]: window.close,
  } )

  // Navigation Hotkey Handlers
  navigationHotKeyHandlers = this.preventDefault( {
    [ NAVIGATOR_SHORTCUTS.previousLine.name ]: this.goPreviousLine,
    [ NAVIGATOR_SHORTCUTS.nextLine.name ]: this.goNextLine,
    [ NAVIGATOR_SHORTCUTS.firstLine.name ]: this.goFirstLine,
    [ NAVIGATOR_SHORTCUTS.lastLine.name ]: this.goLastLine,
    [ NAVIGATOR_SHORTCUTS.autoToggle.name ]: this.autoToggle,
    [ NAVIGATOR_SHORTCUTS.restoreLine.name ]: this.restoreLine,
    [ NAVIGATOR_SHORTCUTS.setMainLine.name ]: this.setMainLine,
    [ NAVIGATOR_SHORTCUTS.goJumpLine.name ]: this.goJumpLine,
    [ NAVIGATOR_SHORTCUTS.goMainLine.name ]: this.goMainLine,
  } )

  render() {
    const { settings, location: { search, pathname }, status } = this.props
    const { controllerOnly } = getUrlState( search )

    const { local: localSettings } = settings
    const { theme: { themeName }, hotkeys } = localSettings

    return (
      <div className="presenter">
        <GlobalHotKeys keyMap={hotkeys} handlers={this.globalHotKeyHandlers} />
        {( !pathname.includes( CONTROLLER_URL ) || pathname.includes( NAVIGATOR_URL ) )
          && <GlobalHotKeys keyMap={hotkeys} handlers={this.navigationHotKeyHandlers} />}

        <CssBaseline />
        <ThemeLoader name={themeName} />

        <Suspense fallback={<Loader />}>
          {!controllerOnly && <Display {...this.props} settings={localSettings} />}
        </Suspense>

        <Suspense fallback={null}>
          <div className={classNames( 'controller-container', { fullscreen: controllerOnly } )}>
            <Link to={CONTROLLER_URL}>
              <IconButton className="expand-icon"><FontAwesomeIcon icon={faPlus} /></IconButton>
            </Link>
            <Route path={CONTROLLER_URL}>
              {props => <Controller {...this.props} {...props} />}
            </Route>
          </div>
        </Suspense>

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

export default hot( Presenter )
