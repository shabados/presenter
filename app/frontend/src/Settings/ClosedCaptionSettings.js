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
          Closed Captioning provides a convenient way of integrating content
          into 3rd party services, typically during a livestream.
          Zoom is currently supported.
        </Typography>
        <br />
        <Typography>
          When a line is activated in the controller and seen on the presenter,
          the same information is sent to the closed captioning services.
          Choose what to display and how to display it with the options below.
        </Typography>
      </Grid>
    </OptionGrid>

    <OptionGrid container align="center">
      <Grid item {...slotSizes.single} className="buttons">
        <TutorialButton href="https://docs.shabados.com/presenter/guides/integrating-closed-captioning-in-zoom-meetings">
          Learn More (Zoom)
        </TutorialButton>
      </Grid>
    </OptionGrid>

    <DynamicOptions device="global" group="closedCaptions" />
  </div>
)

export default ClosedCaptionSettings
