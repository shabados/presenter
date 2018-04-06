import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import { HotKeys } from 'react-hotkeys'

import CssBaseline from 'material-ui/CssBaseline'
import { IconButton } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/fontawesome-free-solid'

import { NAVIGATOR_URL } from './lib/consts'
import controller from './lib/controller'
import ThemeLoader from './components/ThemeLoader'
import Navigator from './components/Navigator'
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

  render() {
    const { shabad, lineId, theme } = this.state

    return (
      <Router>
        <div className="app">
          <CssBaseline />
          <ThemeLoader name={theme} />
          <Display shabad={shabad} lineId={lineId} />
          <div className="navigator-container">
            <Link to={NAVIGATOR_URL}>
              <IconButton className="expand-icon"><FontAwesomeIcon icon={faPlus} /></IconButton>
            </Link>
            <Route
              path={NAVIGATOR_URL}
              render={props => <Navigator {...props} shabad={shabad} lineId={lineId} />}
            />
          </div>
        </div>
      </Router>
    )
  }
}

export default App
