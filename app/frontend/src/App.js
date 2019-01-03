import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import { OVERLAY_URL, SCREEN_READER_URL, CONFIGURATOR_URL, DEFAULT_OPTIONS } from './lib/consts'
import { merge } from './lib/utils'
import controller from './lib/controller'

import ScreenReader from './ScreenReader'
import Overlay from './Overlay'
import Configurator from './Configurator'
import Presenter from './Presenter'

import './App.css'

class App extends Component {
    state = {
      connected: false,
      banis: [],
      bani: null,
      lineId: null,
      mainLineId: null,
      viewedLines: new Set(),
      shabadHistory: [],
      shabad: null,
      settings: merge( { local: controller.readSettings() }, DEFAULT_OPTIONS ),
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

  onConnected = () => this.setState( { connected: true, bani: null, shabad: null } )
  onDisconnected = () => this.setState( { connected: false } )
  onShabad = shabad => this.setState( { shabad, bani: null } )
  onLine = lineId => this.setState( { lineId } )
  onViewedLines = viewedLines => this.setState( { viewedLines } )
  onMainLine = mainLineId => this.setState( { mainLineId } )
  onHistory = shabadHistory => this.setState( { shabadHistory } )
  onBanis = banis => this.setState( { banis } )
  onBani = bani => this.setState( { bani, shabad: null } )
  onSettings = ( { global = {}, ...settings } ) => this.setState( state => ( {
    settings: {
      ...state.settings,
      ...settings,
      global: merge( state.settings.global, global ),
    },
  } ) )

  render() {
    return (
      <Switch>
        <Route path={OVERLAY_URL} render={() => <Overlay {...this.state} />} />
        <Route path={SCREEN_READER_URL} render={() => <ScreenReader {...this.state} />} />
        <Route path={CONFIGURATOR_URL} render={props => <Configurator {...props} {...this.state} />} />
        <Route render={props => <Presenter {...props} {...this.state} />} />
      </Switch>
    )
  }
}

export default App
