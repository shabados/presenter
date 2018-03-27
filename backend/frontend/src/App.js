import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import CssBaseline from 'material-ui/CssBaseline'
import { IconButton } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/fontawesome-free-solid'

import { NAVIGATOR_URL } from './lib/consts'
import controller from './lib/controller'
import Navigator from './components/Navigator'
import Display from './components/Display'

import './App.css'

class App extends Component {
  constructor( props ) {
    super( props )

    this.state = {
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
    return (
      <Router>
        <div className="app">
          <CssBaseline />
          <Display />
          <div className="navigator-container">
            <Link to={NAVIGATOR_URL}>
              <IconButton className="expand-icon">
                <FontAwesomeIcon icon={faPlus} />
              </IconButton>
            </Link>
            <Route path={NAVIGATOR_URL} component={Navigator} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App
