import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import CssBaseline from 'material-ui/CssBaseline'

import Navigator from './components/Navigator'
import Display from './components/Display'
import controller from './lib/controller'

import './App.css'

class App extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      settings: null,
      session: null,
      theme: 'Night',
      connected: false,
    }
  }

  componentDidMount() {
    // Register controller event
    controller.on( 'connected', this.onConnected )
    controller.on( 'disconnected', this.onDisconnected )
  }

  componentWillUnmount() {
    // Deregister event listeners from controller
    controller.off( 'connected', this.onConnected )
    controller.off( 'disconnected', this.onDisconnected )
  }

  onConnected = () => this.setState( { connected: true } )
  onDisconnected = () => this.setState( { connected: false } )

  render() {
    const { theme } = this.state

    return (
      <Router>
        <div className={`app theme-${theme.toLowerCase()}`}>
          <CssBaseline />
          <Display />
          <Route path="/navigator" component={Navigator} />
        </div>
      </Router>
    )
  }
}

export default App
