import React from 'react'

import TutorialButton from '../../components/TutorialButton'
import DynamicOptions, { OptionGrid } from './DynamicOptions'

import './ClosedCaptionSettings.css'

const ClosedCaptionSettings = () => (
  <div className="closed-caption-settings">
    <OptionGrid>
      <div className="col-single">
        <p>
          Closed captioning integrates the currently active line of Shabad OS into the built-in
          subtitle features of 3rd party services, such as YouTube, Facebook, or Zoom. Currently
          only Zoom meetings are supported.
        </p>
      </div>
    </OptionGrid>

    <OptionGrid>
      <div className="col-single buttons">
        <TutorialButton href="https://docs.shabados.com/presenter/guides/integrating-closed-captioning-in-zoom-meetings">
          Learn More
        </TutorialButton>
      </div>
    </OptionGrid>

    <DynamicOptions device="global" group="closedCaptions" />
  </div>
)

export default ClosedCaptionSettings
