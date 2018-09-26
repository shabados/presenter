import React, { Component } from 'react'
import { Link, Route, withRouter, Switch } from 'react-router-dom'

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
  STATES,
  OVERLAY_URL,
  SCREEN_READER_URL,
  SHORTCUT_MAP,
  SHORTCUTS,
  CONFIGURATOR_URL,
} from './lib/consts'
import { getUrlState } from './lib/utils'
import controller from './lib/controller'
import ThemeLoader from './Presenter/ThemeLoader'
import Controller from './Controller'
import ShortcutHelp from './Presenter/ShortcutHelp'
import Display from './Presenter/Display'

import ScreenReader from './ScreenReader'
import Overlay from './Overlay'

import './App.css'
import Configurator from './Configurator'

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
      settings: controller.readSettings(),
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
    controller.on( 'settings', this.onSettings )
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
    controller.off( 'settings', this.onSettings )
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
  onSettings = settings => this.setState( { settings: { ...this.state.settings, ...settings } } )

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

  hotKeyHandlers = this.preventDefault( {
    [ SHORTCUTS.toggleController ]: this.toggleController,
    [ SHORTCUTS.newController ]: () => window.open( `${CONTROLLER_URL}?${STATES.controllerOnly}=true`, '_blank' ),
    [ SHORTCUTS.historyBack ]: () => this.props.history.goBack(),
    [ SHORTCUTS.historyForward ]: () => this.props.history.goForward(),
    [ SHORTCUTS.menu ]: () => this.go( MENU_URL ),
    [ SHORTCUTS.search ]: () => this.go( SEARCH_URL ),
    [ SHORTCUTS.history ]: () => this.go( HISTORY_URL ),
    [ SHORTCUTS.banis ]: () => this.go( BANIS_URL ),
    [ SHORTCUTS.navigator ]: () => this.go( NAVIGATOR_URL ),
    [ SHORTCUTS.clearDisplay ]: controller.clear,
    [ SHORTCUTS.toggleShorcutsHelp ]: () => this.toggleQuery( STATES.showShortcuts ),
    [ SHORTCUTS.toggleFullscreenController ]: this.fullscreenController,
  } )

  render() {
    const { bani, shabad, lineId, settings } = this.state
    const { location: { search } } = this.props
    const { controllerOnly, showShortcuts } = getUrlState( search )

    const { theme: { options: { themeName } } } = settings

    return (
      <Switch>
        <Route path={OVERLAY_URL}><Overlay {...this.state} /></Route>
        <Route path={SCREEN_READER_URL}><ScreenReader {...this.state} /></Route>
        <Route path={CONFIGURATOR_URL}><Configurator {...this.state} /></Route>
        <Route>
          <HotKeys
            component="document-fragment"
            keyMap={SHORTCUT_MAP}
            handlers={this.hotKeyHandlers}
            focused
            attach={window}
          >
            <div className="app">
              <CssBaseline />
              <ThemeLoader name={themeName} />
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
        </Route>
      </Switch>
    )
  }
}

export default withRouter( App )
