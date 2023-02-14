import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

import { BACKEND_PORT, BACKEND_URL, isElectron } from '../lib/consts'
import controller from '../lib/controller'
import CopyButton from './CopyButton'
import { Button } from './SettingComponents'

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
  connected: number
};

const About = ( { connected }: AboutProps ) => {
  const [ about, setAbout ] = useState( null )

  useEffect( () => {
    fetch( `${BACKEND_URL}/about` )
      .then( ( res ) => res.json() )
      .then( setAbout )
  }, [] )

  if ( !about ) return <CircularProgress style={{ alignSelf: 'center' }} />

  return (
    <List className="about">
      <ListItem>
        <Grid container>
          <Grid item xs={6}><Typography variant="body2">Server Address</Typography></Grid>
          <Grid item xs={6}>
            {Object.entries( about.addresses ).map( ( [ name, address ] ) => (
              <CopyButton copyText={`http://${address}:${BACKEND_PORT}`}>{`${address}:${BACKEND_PORT} (${name})`}</CopyButton>
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

export default About
