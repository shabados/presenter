import React from 'react'

import DynamicOptions from './DynamicOptions'

const OverlaySettings = () => (
  <div className="overlay-settings">
    <DynamicOptions device="global" group="overlay" />
  </div>
)

export default OverlaySettings
