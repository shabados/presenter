import React from 'react'

import { Grid, TextField, Typography } from '@material-ui/core'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'

import { slotSizes, IconSlot, OptionGrid } from './DynamicOptions'

const LivestreamSettings = () => (
  <div className="livestream-settings">

    <OptionGrid container>
      <Grid item {...slotSizes.single}>
        <Typography>
          Paste Zoom API Token Below
        </Typography>
      </Grid>
    </OptionGrid>

    <OptionGrid container>
      <IconSlot icon={faShareSquare} />
      <Grid item {...slotSizes.name}><Typography>Zoom API Token</Typography></Grid>
      <Grid item {...slotSizes.option} align="center">
        <TextField />
      </Grid>
    </OptionGrid>

  </div>
)

export default LivestreamSettings
