import './OverlaySettings.css'

import { faShareSquare } from '@fortawesome/free-solid-svg-icons'
import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { BACKEND_URL, isElectron, OVERLAY_PORT } from '../lib/consts'
import controller from '../lib/controller'
import CopyButton from './CopyButton'
import DynamicOptions, { IconSlot, OptionGrid, slotSizes } from './DynamicOptions'
import { Button } from './SettingComponents'
import TutorialButton from './TutorialButton'

const OverlaySettings = () => {
  const [ addresses, setAddresses ] = useState( [] )

  useEffect( () => {
    fetch( `${BACKEND_URL}/about` )
      .then( ( res ) => res.json() )
      .then( ( { addresses } ) => setAddresses( addresses ) )
  }, [] )

  return (
    <div className="overlay-settings">

      <OptionGrid container>
        <Grid item {...slotSizes.single}>
          <Typography>
            Use overlays to set up captions for popular live stream software, such as OBS, Wirecast,
            and vMix. Or use them in full screened web browsers as an alternate presentation to the
            main display. It is also possible to create overlay themes using the theme tool.
          </Typography>
        </Grid>
      </OptionGrid>

      <OptionGrid container align="center">
        <Grid item {...slotSizes.single} className="buttons">
          <TutorialButton className="tutorial-button" href="https://docs.shabados.com/presenter/guides/configuring-live-stream-captions">
            Learn More
          </TutorialButton>
        </Grid>
        <Grid item {...slotSizes.single} className="buttons">
          <TutorialButton className="theme-tool" href="https://themes.shabados.com">
            Theme Tool
          </TutorialButton>
        </Grid>
        <Grid item {...slotSizes.single} className="buttons">
          <Button className="folder-button" disabled={!isElectron} variant="contained" onClick={() => controller.action( 'open-overlay-folder' )}>Open Overlay Folder</Button>
        </Grid>
      </OptionGrid>

      <OptionGrid container>
        <IconSlot icon={faShareSquare} />
        <Grid item {...slotSizes.name}><Typography>Overlay URL</Typography></Grid>
        <Grid item {...slotSizes.option} align="center">
          {Object.entries( addresses ).map( ( [ name, address ] ) => (
            <CopyButton style={{ textAlign: 'center' }} copyText={`http://${address}:${OVERLAY_PORT}/overlay`}>{`${address}:${OVERLAY_PORT}/overlay (${name})`}</CopyButton>
          ) )}
        </Grid>
      </OptionGrid>

      <DynamicOptions device="global" group="overlay" />
    </div>
  )
}

export default OverlaySettings
