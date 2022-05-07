/* eslint-disable no-undef */
import 'react-hot-loader'

/* App entry point */
import ReactDOM from 'react-dom'

import App from './App'
import analytics from './lib/analytics'
import controller from './lib/controller'

// Setup analytics
const { security: { displayAnalytics } = {} } = controller.readSettings()

if ( displayAnalytics ) {
  analytics.initialise()
  analytics.updateSettings( controller.readSettings( true ) )
}

// Render the React app
ReactDOM.render( <App />, document.getElementById( 'root' ) )
