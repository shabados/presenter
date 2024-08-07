import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import analytics from './services/analytics'
import controller from './services/controller'

const settings = controller.readSettings()

if ( settings?.security?.displayAnalytics ) {
  void analytics.initialise()
  analytics.updateSettings( controller.readSettings( true ) )
}

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <App />
  </StrictMode>
)
