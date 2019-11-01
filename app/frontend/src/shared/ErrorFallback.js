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
      <Typography className="header" variant="h5" align="center">
        Something went wrong, and we&#39;re not sure why.
        <Typography align="center">
        If you&#39;ve enabled Analytics, we have received this report and will investigate further.
        </Typography>
      </Typography>

      {!!countdown && (
      <Typography variant="subtitle2" align="center">
        {`Reloading in ${countdown}...`}
      </Typography>
      )}

      {showError && ( <div className="error">{error ? error.toString() : 'Unknown error'}</div> )}

      <Grid className="buttons" container justify="center">
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
