import React, { Component, useState, useEffect } from 'react'
import { string, bool } from 'prop-types'

import { Typography, Button, Grid } from '@material-ui/core'

import controller from '../lib/controller'

import './ErrorFallback.css'

const RELOAD_COUNTDOWN = 10 // 10 second countdown before automatic reload

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
      <Typography className="header" variant="h5">
        Hmm.
        <br />
        <Typography variant="overline">
          Though we broke Shabad OS plenty, it seems we never broke it quite like this.
        </Typography>
        <Typography>
          <br />
          Usage Analytics (if enabled in System Options), will send us a report.
          <br />
          A prompt investigation into what, why, and how this happened will ensue.
          <br />
          <br />
          If you wish to help, please send an email to team@shabados.com
        </Typography>
      </Typography>

      {!!countdown && (
      <Typography variant="subtitle2" align="center">
        {`Reloading in ${countdown}...`}
      </Typography>
      )}

      {showError && ( <div className="error">{error ? error.toString() : 'Unknown error'}</div> )}

      <Grid className="buttons" container justify="space-evenly">
        <Button variant="outlined" onClick={onReloadClick}>
          {countdown ? 'Cancel reload' : 'Reload now'}
        </Button>

        <Button variant="outlined" onClick={controller.resetSettings}>Reset Settings</Button>

        <Button variant="outlined" onClick={() => setErrorVisible( !showError )}>
          {showError ? 'Hide Error' : 'Show Error'}
        </Button>
      </Grid>
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
