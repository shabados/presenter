/* eslint-disable no-undef */
import 'react-hot-loader'

/* App entry point */
import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'

import { SENTRY_DSN } from './lib/consts'

import App from './App'
import './index.css'

// Enable Sentry if in production
if ( process.env === 'production' ) Sentry.init( { dsn: SENTRY_DSN } )

// Render the React app
ReactDOM.render( <App />, document.getElementById( 'root' ) )
