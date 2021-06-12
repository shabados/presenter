import React from 'react'

import { Grid, Typography } from '@material-ui/core'

import TutorialButton from './TutorialButton'
import DynamicOptions, { slotSizes, OptionGrid } from './DynamicOptions'

import './ClosedCaptionSettings.css'

const ClosedCaptionSettings = () => (
  <div className="closed-caption-settings">
    <OptionGrid container>
      <Grid item {...slotSizes.single}>
        <Typography>
          Closed captioning integrates the currently active line of Shabad OS into the built-in
          subtitle features of 3rd party services, such as YouTube, Facebook, or Zoom. Currently
          only Zoom meetings are supported.
        </Typography>
      </Grid>
    </OptionGrid>

    <OptionGrid container align="center">
      <Grid item {...slotSizes.single} className="buttons">
        <TutorialButton href="https://docs.shabados.com/presenter/guides/integrating-closed-captioning-in-zoom-meetings">
          Learn More
        </TutorialButton>
      </Grid>
    </OptionGrid>

    <DynamicOptions device="global" group="closedCaptions" />
  </div>
)

export default ClosedCaptionSettings
