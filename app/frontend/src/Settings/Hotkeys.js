import React from 'react'
import { objectOf, arrayOf, string } from 'prop-types'
import { Grid, List, ListItem, ListItemText } from '@material-ui/core'

import './Hotkeys.css'

/**
 * Renders all hotkeys with descriptions.
 * @param {Object} keys The hotkeys themselves, correpsonding to a name.
 * @param {Object} shortcuts Which shortcuts in `keys` to actually render.
 */
const Hotkeys = ( { keys, shortcuts } ) => (
  <List className="hotkeys">
    {Object.values( shortcuts ).map( name => (
      <ListItem key={name}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Grid container>
              {keys[ name ].map( key => (
                <Grid key={key} item xs>
                  <code>{key}</code>
                </Grid>
            ) )}
            </Grid>
          </Grid>
          <Grid item xs>
            <ListItemText className="text">{name}</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
      ) ) }
  </List>
)

Hotkeys.propTypes = {
  shortcuts: objectOf( string ).isRequired,
  keys: objectOf( arrayOf( string ) ).isRequired,
}

export default Hotkeys
