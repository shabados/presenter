import React, { Component } from 'react'
import { Link, Route, withRouter } from 'react-router-dom'

import { HotKeys } from 'react-hotkeys'
import queryString from 'qs'

import CssBaseline from 'material-ui/CssBaseline'
import { IconButton } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/fontawesome-free-solid'

import {
  BANIS_URL,
  CONTROLLER_URL,
  HISTORY_URL,
  MENU_URL,
  NAVIGATOR_URL,
  SEARCH_URL,
  CONTROLLER_ONLY_QUERY,
  SHOW_SHORTCUTS_QUERY,
  SHORTCUTS,
} from './lib/consts'
import controller from './lib/controller'
import ThemeLoader from './components/ThemeLoader'
import Controller from './components/Controller'
import ShortcutHelp from './components/ShortcutHelp'
import Display from './components/Display'

import './App.css'

class App extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      connected: false,
      banis: [],
      bani: null,
      lineId: null,
      mainLineId: null,
      viewedLines: new Set(),
      shabadHistory: [],
      shabad: null,
      theme: 'day',
    }
  }

  componentDidMount() {
    // Register controller event
    controller.on( 'connected', this.onConnected )
    controller.on( 'disconnected', this.onDisconnected )
    controller.on( 'shabad', this.onShabad )
    controller.on( 'line', this.onLine )
    controller.on( 'mainLine', this.onMainLine )
    controller.on( 'viewedLines', this.onViewedLines )
    controller.on( 'history', this.onHistory )
    controller.on( 'banis', this.onBanis )
    controller.on( 'bani', this.onBani )
  }

  componentWillUnmount() {
    // Deregister event listeners from controller
    controller.off( 'connected', this.onConnected )
    controller.off( 'disconnected', this.onDisconnected )
    controller.off( 'shabad', this.onShabad )
    controller.off( 'line', this.onLine )
    controller.off( 'mainLine', this.onMainLine )
    controller.off( 'viewedLines', this.onViewedLines )
    controller.off( 'banis', this.onBanis )
    controller.off( 'bani', this.onBani )
  }

  onConnected = () => this.setState( { connected: true } )
  onDisconnected = () => this.setState( { connected: false } )
  onShabad = shabad => this.setState( { shabad, bani: null } )
  onLine = lineId => this.setState( { lineId } )
  onViewedLines = viewedLines => this.setState( { viewedLines } )
  onMainLine = mainLineId => this.setState( { mainLineId } )
  onHistory = shabadHistory => this.setState( { shabadHistory } )
  onBanis = banis => this.setState( { banis } )
  onBani = bani => this.setState( { bani, shabad: null } )

  /**
   * Sets the query string parameters, retaining any currently present.
   * @param params The query string parameters.
   */
  setQueryParams = params => {
    const { history, location } = this.props
    const { search } = location

    const previousSearch = queryString.parse( search, { ignoreQueryPrefix: true } )
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

    this.toggleQuery( CONTROLLER_ONLY_QUERY )
  }

  /**
   * Toggles the given query string parameter.
   * @param query The query string parameter to toggle.
   */
  toggleQuery = query => {
    const { location: { search } } = this.props

    const parsed = queryString.parse( search, { ignoreQueryPrefix: true } )
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

  hotKeyHandlers = this.preventDefault( {
    'Toggle Controller': this.toggleController,
    'New Controller': () => window.open( `${CONTROLLER_URL}?${CONTROLLER_ONLY_QUERY}=true`, '_blank' ),
    'History Back': () => this.props.history.goBack(),
    'History Forwards': () => this.props.history.goForward(),
    Menu: () => this.go( MENU_URL ),
    Search: () => this.go( SEARCH_URL ),
    History: () => this.go( HISTORY_URL ),
    Bookmarks: () => this.go( BANIS_URL ),
    Navigator: () => this.go( NAVIGATOR_URL ),
    'Clear Display': controller.clear,
    'Toggle Shortcuts Help': () => this.toggleQuery( SHOW_SHORTCUTS_QUERY ),
    'Toggle Fullscreen Controller': this.fullscreenController,
  } )

  render() {
    const { bani, shabad, lineId, theme } = this.state
    const { location: { search } } = this.props
    const {
      controllerOnly,
      showShortcuts,
    } = queryString.parse( search, { ignoreQueryPrefix: true } )

    return (
      <HotKeys
        component="document-fragment"
        keyMap={SHORTCUTS}
        handlers={this.hotKeyHandlers}
        focused
        attach={window}
      >
        <div className="app">
          <CssBaseline />
          <ThemeLoader name={theme} />
          {!controllerOnly ? <Display shabad={shabad} bani={bani} lineId={lineId} /> : null}
          <div className={`controller-container ${controllerOnly ? 'fullscreen' : ''}`}>
            <Link to={CONTROLLER_URL}>
              <IconButton className="expand-icon"><FontAwesomeIcon icon={faPlus} /></IconButton>
            </Link>
            <Route
              path={CONTROLLER_URL}
              render={props => <Controller {...this.state} {...props} />}
            />
          </div>
          {showShortcuts ? <ShortcutHelp /> : null}
        </div>
      </HotKeys>
    )
  }
}

export default withRouter( App )
