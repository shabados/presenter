/* eslint-disable no-undef */
import 'react-hot-loader'

/* App entry point */
import React from 'react'
import ReactDOM from 'react-dom'

import analytics from './lib/analytics'
import controller from './lib/controller'

import App from './App'

// Setup analytics
const { security: { displayAnalytics } = {} } = controller.readSettings()

if ( displayAnalytics ) {
  analytics.initialise()
  analytics.updateSettings( controller.readSettings( true ) )
}

// Render the React app
ReactDOM.render( <App />, document.getElementById( 'root' ) )
