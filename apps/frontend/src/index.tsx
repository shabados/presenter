import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import analytics from './lib/analytics'
import controller from './lib/controller'

const settings = controller.readSettings()

if ( settings?.security?.displayAnalytics ) {
  analytics.initialise()
  analytics.updateSettings( controller.readSettings( true ) )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
