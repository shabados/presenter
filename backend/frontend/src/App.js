import React, { Component } from 'react'
import { Link, Route, withRouter } from 'react-router-dom'

import { HotKeys } from 'react-hotkeys'
import queryString from 'query-string'

import CssBaseline from 'material-ui/CssBaseline'
import { IconButton } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/fontawesome-free-solid'

import {
  BOOKMARKS_URL,
  CONTROLLER_URL,
  HISTORY_URL, MENU_URL,
  SEARCH_URL,
  SHORTCUTS
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
      lineId: null,
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
  }

  componentWillUnmount() {
    // Deregister event listeners from controller
    controller.off( 'connected', this.onConnected )
    controller.off( 'disconnected', this.onDisconnected )
    controller.off( 'shabad', this.onShabad )
    controller.off( 'line', this.onLine )
  }

  onConnected = () => this.setState( { connected: true } )
  onDisconnected = () => this.setState( { connected: false } )
  onShabad = shabad => this.setState( { shabad } )
  onLine = lineId => this.setState( { lineId } )

  /**
   * More concise form to navigate to URLs, retaining query params.
   * @param pathname The path to navigate to.
   */
  go = pathname => {
    const { history, location } = this.props

    history.push( { ...location, pathname } )
  }

  /**
   * Navigates to a URL by setting the query string parameters, retaining any currently present.
   * @param params The query string parameters.
   */
  goSearch = params => {
    const { history, location } = this.props
    const { search } = location

    const previousSearch = queryString.parse( search )
    history.push( {
      ...location,
      search: queryString.stringify( { ...previousSearch, ...params } )
    } )
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

    this.toggleQuery( 'controllerOnly' )
  }

  /**
   * Toggles the given query string parameter.
   * @param query The query string parameter to toggle.
   */
  toggleQuery = query => {
    const { location: { search } } = this.props

    const parsed = queryString.parse( search )
    this.goSearch( {
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
      [ name ]: event => event.preventDefault() & handler( event ),
    } ), {} )

  hotKeyHandlers = this.preventDefault( {
    'Toggle Controller': this.toggleController,
    'New Controller': () => window.open( '/controller?controllerOnly=true', '_blank' ),
    'History Back': () => this.props.history.goBack(),
    'History Forwards': () => this.props.history.goForward(),
    'Menu': () => this.go( MENU_URL ),
    'Search': () => this.go( SEARCH_URL ),
    'History': () => this.go( HISTORY_URL ),
    'Bookmarks': () => this.go( BOOKMARKS_URL ),
    'Controller': () => this.go( CONTROLLER_URL ),
    'Clear Display': () => controller.line( null ),
    'Toggle Shortcuts Help': () => this.toggleQuery( 'showShortcuts' ),
    'Toggle Fullscreen Controller': this.fullscreenController,
  } )

  render() {
    const { shabad, lineId, theme } = this.state
    const { location: { search } } = this.props
    const { controllerOnly, showShortcuts } = queryString.parse( search )

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
          {!controllerOnly ? <Display shabad={shabad} lineId={lineId} /> : null}
          <div className={`controller-container ${controllerOnly ? 'fullscreen' : ''}`}>
            <Link to={CONTROLLER_URL}>
              <IconButton className="expand-icon"><FontAwesomeIcon icon={faPlus} /></IconButton>
            </Link>
            <Route
              path={CONTROLLER_URL}
              render={props => <Controller {...props} shabad={shabad} lineId={lineId} />}
            />
          </div>
          {showShortcuts ? <ShortcutHelp /> : null}
        </div>
      </HotKeys>
    )
  }
}

export default withRouter( App )
