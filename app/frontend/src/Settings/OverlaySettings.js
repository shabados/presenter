import React, { useState, useEffect } from 'react'

import { Button, Grid, Typography } from '@material-ui/core'

import { BACKEND_URL, BACKEND_PORT, isElectron } from '../lib/consts'
import controller from '../lib/controller'

import CopyButton from '../shared/CopyButton'

import DynamicOptions from './DynamicOptions'

const OverlaySettings = () => {
  const [ addresses, setAddresses ] = useState( [] )

  useEffect( () => {
    fetch( `${BACKEND_URL}/about` )
      .then( res => res.json() )
      .then( ( { addresses } ) => setAddresses( addresses ) )
  }, [] )


  return (
    <div className="overlay-settings">
      <Grid container className="option">
        <Grid item xs={5}><Typography>Overlay URL</Typography></Grid>
        <Grid item xs={7}>
          <Typography>
            {Object.entries( addresses ).map( ( [ name, address ] ) => (
              <CopyButton copyText={`http://${address}:${BACKEND_PORT}/overlay`}>{`${address}:${BACKEND_PORT}/overlay (${name})`}</CopyButton>
            ) )}
          </Typography>
        </Grid>
      </Grid>

      <DynamicOptions device="global" group="overlay" />

      <Grid style={{ marginTop: 20 }} container justify="center" xs={12} md={9} lg={7}>

        <Grid item>
          <Button disabled={!isElectron} variant="outlined" onClick={() => controller.action( 'open-overlay-folder' )}>Open Overlay Folder</Button>
        </Grid>

      </Grid>
    </div>
  )
}

export default OverlaySettings
