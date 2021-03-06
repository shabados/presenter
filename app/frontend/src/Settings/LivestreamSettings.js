import React from 'react'

import { Grid, Typography } from '@material-ui/core'

import DynamicOptions, { slotSizes, OptionGrid } from './DynamicOptions'

const LivestreamSettings = () => (
  <div className="livestream-settings">

    <OptionGrid container>
      <Grid item {...slotSizes.single}>
        <Typography>
          Paste Zoom API Token Below
        </Typography>
      </Grid>
    </OptionGrid>

    <DynamicOptions device="global" group="livestream" />

  </div>
)

export default LivestreamSettings
