import './ErrorFallback.css'

import { Button, Grid, Typography } from '@mui/material'
import { Component, ComponentType, useEffect, useState } from 'react'

import controller from '../lib/controller'

const RELOAD_COUNTDOWN = 10 // 10 second countdown before automatic reload

type ErrorFallbackProps = {
  error?: string,
  autoReset?: boolean,
}

const ErrorFallback = ( { error, autoReset = true }: ErrorFallbackProps ) => {
  const [ showError, setErrorVisible ] = useState( false )
  const [ countdown, setCountdown ] = useState( autoReset ? RELOAD_COUNTDOWN : null )
  const [ timerHandle, setTimerHandle ] = useState<number>()

  useEffect( () => {
    if ( countdown === null ) return

    setTimerHandle( window.setTimeout( () => {
      if ( countdown > 0 ) setCountdown( countdown - 1 )
      else window.location.reload()
    }, 1000 ) )
  }, [ countdown ] )

  const onReloadClick = () => {
    if ( countdown ) {
      window.clearTimeout( timerHandle )
      setCountdown( null )
    } else window.location.reload()
  }

  return (
    <div className="error-fallback">
      <Typography className="header" variant="h5">
        Have you tried turning it off and on again?
        <Typography>
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
        </Typography>
      </Typography>

      {!!countdown && (
        <Typography variant="subtitle2" align="center">
          {`Reloading in ${countdown}...`}
        </Typography>
      )}

      {showError && ( <div className="error">{error ? error.toString() : 'Unknown error'}</div> )}

      <Grid className="buttons" container justifyContent="space-evenly">
        <Button variant="outlined" onClick={onReloadClick}>
          {countdown ? 'Cancel reload' : 'Reload now'}
        </Button>

        <Button variant="outlined" onClick={() => controller.resetSettings()}>Reset Settings</Button>

        <Button variant="outlined" onClick={() => setErrorVisible( !showError )}>
          {showError ? 'Hide Error' : 'Show Error'}
        </Button>
      </Grid>
    </div>
  )
}

export default ErrorFallback

export const withErrorFallback = ( Comp: ComponentType ) => (
  class WithErrorFallback extends Component {
    state = { error: null }

    static getDerivedStateFromError( error: string ) {
      return { error }
    }

    render() {
      const { error } = this.state
      if ( error ) return <ErrorFallback error={error} />

      return <Comp {...this.props} />
    }
  } )
