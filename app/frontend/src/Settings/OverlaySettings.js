import React, { useState, useEffect } from 'react'

import { faShareSquare } from '@fortawesome/free-solid-svg-icons'

import { BACKEND_URL, OVERLAY_PORT, isElectron } from '../lib/consts'
import controller from '../lib/controller'

import CopyButton from './CopyButton'
import TutorialButton from './TutorialButton'
import DynamicOptions, { IconSlot, OptionGrid } from './DynamicOptions'
import { Button } from './SettingComponents'

import './OverlaySettings.css'

const OverlaySettings = () => {
  const [ addresses, setAddresses ] = useState( [] )

  useEffect( () => {
    fetch( `${BACKEND_URL}/about` )
      .then( res => res.json() )
      .then( ( { addresses } ) => setAddresses( addresses ) )
  }, [] )

  return (
    <div className="overlay-settings">

      <OptionGrid>
        <div className="col-single">
          <p>
            Use overlays to set up captions for popular live stream software, such as OBS, Wirecast,
            and vMix. Or use them in full screened web browsers as an alternate presentation to the
            main display. It is also possible to create overlay themes using the theme tool.
          </p>
        </div>
      </OptionGrid>

      <OptionGrid>
        <div className="col-single buttons">
          <TutorialButton className="tutorial-button" href="https://docs.shabados.com/presenter/guides/configuring-live-stream-captions">
            Learn More
          </TutorialButton>
        </div>
        <div className="col-single buttons">
          <TutorialButton className="theme-tool" href="https://themes.shabados.com">
            Theme Tool
          </TutorialButton>
        </div>
        <div className="col-single buttons">
          <Button className="folder-button" disabled={!isElectron} onClick={() => controller.action( 'open-overlay-folder' )}>Open Overlay Folder</Button>
        </div>
      </OptionGrid>

      <OptionGrid>
        <IconSlot icon={faShareSquare} />
        <div className="col-name"><span>Overlay URL</span></div>
        <div className="col-option">
          {Object.entries( addresses ).map( ( [ name, address ] ) => (
            <CopyButton key={name} style={{ textAlign: 'center' }} copyText={`http://${address}:${OVERLAY_PORT}/overlay`}>{`${address}:${OVERLAY_PORT}/overlay (${name})`}</CopyButton>
          ) )}
        </div>
      </OptionGrid>

      <DynamicOptions device="global" group="overlay" />
    </div>
  )
}

export default OverlaySettings
