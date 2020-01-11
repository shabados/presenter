import React, { useState, useEffect } from 'react'

import { Button, Grid, Typography } from '@material-ui/core'

import { BACKEND_URL, BACKEND_PORT, isElectron } from '../lib/consts'
import controller from '../lib/controller'

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
      <Grid container>
        <Grid item xs={6}><Typography variant="body2">Overlay URL</Typography></Grid>
        <Grid item xs={6}>
          <Typography>
            {Object.entries( addresses ).map( ( [ name, address ] ) => (
              <Typography>{`${address}:${BACKEND_PORT}/overlay (${name})`}</Typography>
            ) )}
          </Typography>
        </Grid>
      </Grid>

      <DynamicOptions device="global" group="overlay" />

      <Grid container justify="center" xs={12} md={9} lg={7}>

        <Grid item>
          <Button disabled={!isElectron} variant="outlined" onClick={controller.openOverlayFolder}>Open Overlay Folder</Button>
        </Grid>

      </Grid>
    </div>
  )
}

export default OverlaySettings
