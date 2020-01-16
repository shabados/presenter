import React, { useState, useEffect } from 'react'
import { number } from 'prop-types'

import {
  List,
  ListItem,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core'

import { BACKEND_URL, BACKEND_PORT } from '../lib/consts'

import CopyButton from './CopyButton'

const aboutFields = [
  [ 'version', 'Shabad OS Version' ],
  [ 'databaseVersion', 'Shabad OS Database Version' ],
  [ 'hostname', 'Shabad OS Host' ],
  [ 'platform', 'Platform' ],
  [ 'arch', 'Architecture' ],
  [ 'cpus', 'CPU(s)' ],
]

const About = ( { connected } ) => {
  const [ about, setAbout ] = useState( null )

  useEffect( () => {
    fetch( `${BACKEND_URL}/about` )
      .then( res => res.json() )
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
    </List>
  )
}

About.propTypes = {
  connected: number.isRequired,
}

export default About
