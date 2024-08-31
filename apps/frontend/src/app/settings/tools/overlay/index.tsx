import { faShareSquare } from '@fortawesome/free-regular-svg-icons'
import { Grid, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

import { API_URL, isElectron, PORT } from '~/helpers/consts'
import controller from '~/services/controller'

import CopyButton from '../../-components/CopyButton'
import DynamicOptions, { IconSlot, OptionGrid, slotSizes } from '../../-components/DynamicOptions'
import { Button } from '../../-components/SettingsComponents'
import TutorialButton from '../../-components/TutorialButton'

const OverlaySettings = () => {
  const { about: { addresses } } = Route.useLoaderData()

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
          <Button className="folder-button" disabled={!isElectron} onClick={() => controller.action( 'open-overlay-folder' )}>Open Overlay Folder</Button>
        </Grid>
      </OptionGrid>

      <OptionGrid container>
        <IconSlot icon={faShareSquare} />
        <Grid item {...slotSizes.name}><Typography>Overlay URL</Typography></Grid>
        <Grid item {...slotSizes.option} align="center">
          {Object.entries( addresses ).map( ( [ name, address ] ) => (
            <CopyButton style={{ textAlign: 'center' }} copyText={`http://${address}:${PORT}/overlay`}>{`${address}:${PORT}/overlay (${name})`}</CopyButton>
          ) )}
        </Grid>
      </OptionGrid>

      <DynamicOptions device="global" group="overlay" />
    </div>
  )
}

type AboutType = {
  addresses: string[],
}

export const Route = createFileRoute( '/settings/tools/overlay/' )( {
  component: OverlaySettings,
  loader: async () => {
    const about = await fetch( `${API_URL}/about` )
      .then( ( res ) => res.json() as Promise<AboutType> )

    return { about }
  },
} )
