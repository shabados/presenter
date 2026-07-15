import React from 'react'
import { createRoot } from 'react-dom/client'

import analytics from './lib/analytics'
import controller from './lib/controller'

import App from './App'

const { security: { displayAnalytics } = {} } = controller.readSettings()

if ( displayAnalytics ) {
  analytics.initialise()
  analytics.updateSettings( controller.readSettings( true ) )
}

createRoot( document.getElementById( 'root' ) ).render( <App /> )
