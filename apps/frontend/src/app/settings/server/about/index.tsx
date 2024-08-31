import { CircularProgress, Grid, List, ListItem, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

import Loader from '~/components/Loader'
import { API_URL, isElectron, PORT } from '~/helpers/consts'
import controller from '~/services/controller'

import CopyButton from '../../-components/CopyButton'
import { Button } from '../../-components/SettingsComponents'

const aboutFields = [
  [ 'version', 'Shabad OS Version' ],
  [ 'databaseVersion', 'Shabad OS Database Version' ],
  [ 'hostname', 'Shabad OS Host' ],
  [ 'platform', 'Platform' ],
  [ 'release', 'Release' ],
  [ 'arch', 'Architecture' ],
  [ 'cpus', 'CPU(s)' ],
]

type AboutProps = {
  connected: number,
}

const About = ( { connected }: AboutProps ) => {
  const { about } = Route.useLoaderData()

  if ( !about ) return <CircularProgress style={{ alignSelf: 'center' }} />

  return (
    <List className="about">
      <ListItem>
        <Grid container>
          <Grid item xs={6}><Typography variant="body2">Server Address</Typography></Grid>
          <Grid item xs={6}>
            {Object.entries( about.addresses ).map( ( [ name, address ] ) => (
              <CopyButton copyText={`http://${address}:${PORT}`}>{`${address}:${PORT} (${name})`}</CopyButton>
            ) )}
          </Grid>
        </Grid>
      </ListItem>

      {aboutFields.map( ( [ key, name ] ) => (
        <ListItem key={key}>
          <Grid container>
            <Grid item xs={6}><Typography variant="body2">{name}</Typography></Grid>
            <Grid item xs={6}><Typography>{about[ key ]}</Typography></Grid>
          </Grid>
        </ListItem>
      ) )}

      <ListItem>
        <Grid container>
          <Grid item xs={6}><Typography variant="body2">Connected Devices</Typography></Grid>
          <Grid item xs={6}><Typography>{connected}</Typography></Grid>
        </Grid>
      </ListItem>

      <ListItem>
        <Grid container justifyContent="center">
          <Button className="folder-button" disabled={!isElectron} variant="contained" onClick={() => controller.action( 'open-logs-folder' )}>Open Logs Folder</Button>
        </Grid>
      </ListItem>

    </List>
  )
}

type AboutType = {
  addresses: string[],
}

export const Route = createFileRoute( '/settings/server/about/' )( {
  component: About,
  pendingComponent: Loader,
  loader: async () => {
    const about = await fetch( `${API_URL}/about` )
      .then( ( res ) => res.json() as Promise<AboutType> )

    return { about }
  },
} )
