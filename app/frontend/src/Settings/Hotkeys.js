import React from 'react'
import { objectOf, arrayOf, string, shape } from 'prop-types'
import { groupBy } from 'lodash'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'


import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Tooltip from '@material-ui/core/Tooltip'

import './Hotkeys.css'

/**
 * Renders all hotkeys with descriptions.
 * @param {Object} keys The hotkeys themselves, correpsonding to a name.
 * @param {Object} shortcuts Which shortcuts in `keys` to actually render.
 */
const Hotkeys = ( { keys, shortcuts } ) => (
  <List className="hotkeys">
    {Object
      .entries( groupBy( shortcuts, ( { group } ) => group ) )
      .map( ( [ groupName, hotkeys ] ) => (
        <ListItem key={groupName} className="group">
          <ListSubheader className="name" disableSticky>{groupName}</ListSubheader>
          <List className="group-hotkeys">
            {Object.values( hotkeys ).map( ( { name, description } ) => (
              <ListItem key={name} className="hotkey">
                <Grid container className="name" alignItems="center">

                  <Grid item xs={4}>
                    <ListItemText className="text">{name}</ListItemText>
                  </Grid>

                  <Grid item xs={1}>
                    {description && (
                    <Tooltip title={description}>
                      <FontAwesomeIcon icon={faQuestionCircle} />
                    </Tooltip>
                    )}
                  </Grid>

                  <Grid className="keys" item xs={6}>
                    <Grid container>
                      {keys[ name ].map( key => (
                        <Grid key={key} item xs>
                          <code>{key}</code>
                        </Grid>
                      ) )}
                    </Grid>
                  </Grid>

                </Grid>
              </ListItem>
            ) )}
          </List>
        </ListItem>
      ) )}
  </List>
)

Hotkeys.propTypes = {
  shortcuts: objectOf( shape( { name: string, group: string, description: string } ) ).isRequired,
  keys: objectOf( arrayOf( string ) ).isRequired,
}

export default Hotkeys
