import React, { PureComponent, lazy, Suspense } from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { configure } from 'react-hotkeys'

import { OVERLAY_URL, SCREEN_READER_URL, SETTINGS_URL, DEFAULT_OPTIONS, PRESENTER_URL, BACKEND_URL } from './lib/consts'
import { merge } from './lib/utils'
import controller from './lib/controller'

import Overlay from './Overlay'

import './App.css'

const ScreenReader = lazy( () => import( './ScreenReader' ) )
const Presenter = lazy( () => import( './Presenter' ) )
const Settings = lazy( () => import( './Settings' ) )

class App extends PureComponent {
  state = {
    connected: false,
    banis: [],
    bani: null,
    lineId: null,
    mainLineId: null,
    viewedLines: new Set(),
    shabadHistory: [],
    shabad: null,
    recommendedSources: null,
    status: null,
    settings: merge( { local: controller.readSettings() }, DEFAULT_OPTIONS ),
  }

  componentWillMount() {
    // Configure react-hotkeys
    configure( {
      ignoreTags: [],
    } )
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
    controller.on( 'status', this.onStatus )
    controller.on( 'settings', this.onSettings )

    // Get recommended sources and set as settings, if there are none
    const { settings: { local: { sources } } } = this.state
    fetch( `${BACKEND_URL}/sources` )
      .then( res => res.json() )
      .then( ( { recommended } ) => {
        this.setState( { recommendedSources: sources } )
        if ( !Object.keys( sources ).length ) controller.setSettings( { sources: recommended } )
      } )
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
    controller.off( 'status', this.onStatus )
    controller.off( 'settings', this.onSettings )
  }

  onConnected = () => this.setState( { connected: true, bani: null, shabad: null } )
  onDisconnected = () => this.setState( { connected: false } )
  onShabad = shabad => this.setState( { shabad, bani: null } )
  onLine = lineId => this.setState( { lineId } )
  onViewedLines = viewedLines => this.setState( { viewedLines } )
  onMainLine = mainLineId => this.setState( { mainLineId } )
  onHistory = shabadHistory => this.setState( { shabadHistory } )
  onStatus = status => this.setState( { status } )
  onBanis = banis => this.setState( { banis } )
  onBani = bani => this.setState( { bani, shabad: null } )
  onSettings = ( { global = {}, ...settings } ) => this.setState( state => ( {
    settings: {
      ...state.settings,
      ...settings,
      global: merge( state.settings.global, global ),
    },
  } ) )

  components = [
    [ Overlay, OVERLAY_URL ],
    [ ScreenReader, SCREEN_READER_URL ],
    [ Settings, SETTINGS_URL ],
    [ Presenter, PRESENTER_URL ],
  ].map( ( [ Component, path ] ) => [ props => <Component {...props} {...this.state} />, path ] )

  render() {
    return (
      <Suspense fallback={<p>Loading</p>}>
        <Router>
          <Switch>
            {this.components.map( ( [ Component, path ] ) => (
              <Route key={path} path={path} component={Component} />
            ) )}
          </Switch>
        </Router>
      </Suspense>
    )
  }
}

export default App
