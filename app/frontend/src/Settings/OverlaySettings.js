import React from 'react'

import { Dropdown } from './SettingComponents'
import DynamicOptions from './DynamicOptions'

const OverlaySettings = () => {
  const x = 2

  return (
    <div className="overlay-settings">
      <DynamicOptions device="global" group="overlay" />
    </div>
  )
}

export default OverlaySettings
