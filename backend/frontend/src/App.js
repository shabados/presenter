import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import CssBaseline from 'material-ui/CssBaseline'
import { IconButton } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/fontawesome-free-solid'

import { THEME_URL, NAVIGATOR_URL } from './lib/consts'
import controller from './lib/controller'
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

  /**
   * Component to load a theme using a `<link>` tag.
   * @param name The name of the CSS theme to load from the server.
   * @constructor
   */
  ThemeLoader = ( { name } ) => <link rel="stylesheet" href={`${THEME_URL}/${name}.css`} />

  render() {
    const { shabad, lineId, theme } = this.state

    return (
      <Router>
        <div className="app">
          <CssBaseline />
          <this.ThemeLoader name={theme} />
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
