import React, { Component, useState, useEffect } from 'react'
import { string, bool } from 'prop-types'

import controller from '../lib/controller'

import './ErrorFallback.css'

const RELOAD_COUNTDOWN = 10

const ErrorFallback = ( { error, autoReset } ) => {
  const [ showError, setErrorVisible ] = useState( false )
  const [ countdown, setCountdown ] = useState( autoReset ? RELOAD_COUNTDOWN : null )
  const [ timerHandle, setTimerHandle ] = useState( null )

  useEffect( () => {
    if ( countdown === null ) return

    setTimerHandle( setTimeout( () => {
      if ( countdown > 0 ) setCountdown( countdown - 1 )
      else window.location.reload()
    }, 1000 ) )
  }, [ countdown ] )

  const onReloadClick = () => {
    if ( countdown ) {
      clearTimeout( timerHandle )
      setCountdown( null )
    } else window.location.reload()
  }

  return (
    <div className="error-fallback">
      <h5 className="header">
        Have you tried turning it off and on again?
        <p>
          <span>
            Though we&apos;ve broken Shabad OS plenty,
            it seems we&apos;ve never broken it quite like this.
          </span>
          <span>
            Usage Analytics (if enabled in System Options), will send us a report.
            A prompt investigation into what, why, and how this happened will ensue.
          </span>
          <span>
            If you wish to help, please send an email to team@shabados.com
          </span>
        </p>
      </h5>

      {!!countdown && (
        <p className="subtitle2" style={{ textAlign: 'center' }}>
          {`Reloading in ${countdown}...`}
        </p>
      )}

      {showError && ( <div className="error">{error ? error.toString() : 'Unknown error'}</div> )}

      <div className="buttons">
        <button type="button" onClick={onReloadClick}>
          {countdown ? 'Cancel reload' : 'Reload now'}
        </button>

        <button type="button" onClick={() => controller.resetSettings()}>Reset Settings</button>

        <button type="button" onClick={() => setErrorVisible( !showError )}>
          {showError ? 'Hide Error' : 'Show Error'}
        </button>
      </div>
    </div>
  )
}

ErrorFallback.propTypes = {
  error: string,
  autoReset: bool,
}

ErrorFallback.defaultProps = {
  error: null,
  autoReset: true,
}

export default ErrorFallback

export const withErrorFallback = Comp => class WithErrorFallback extends Component {
  state = { error: null }

  static getDerivedStateFromError( error ) {
    return { error }
  }

  render() {
    const { error } = this.state
    if ( error ) return <ErrorFallback error={error} />

    return <Comp {...this.props} />
  }
}
