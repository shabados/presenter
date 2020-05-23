import React from 'react'
import { objectOf, arrayOf, string, shape } from 'prop-types'
import { groupBy } from 'lodash'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import { Button, Tooltip, ListSubheader, ListItemText, ListItem, List, Grid, Typography } from '@material-ui/core'

import { ResetButton } from './DynamicOptions'

import './Hotkeys.css'

/**
 * Renders all hotkeys with descriptions.
 * @param {Object} keys The hotkeys themselves, correpsonding to a name.
 * @param {Object} shortcuts Which shortcuts in `keys` to actually render.
 */
const Hotkeys = ( { keys, shortcuts, device } ) => {
  const editable = device === 'local'

  return (
    <List className="hotkeys">
      {Object
        .entries( groupBy( shortcuts, ( { group } ) => group ) )
        .map( ( [ groupName, hotkeys ] ) => (
          <ListItem key={groupName} className="group">

            <Typography className="name" variant="subtitle2">{groupName}</Typography>

            <div className="group-hotkeys">
              {hotkeys.map( ( { name, description, required } ) => (
                <div key={name} className="hotkey">
                  <Grid container className="name" alignItems="center">

                    <Grid item xs={4}>
                      <Typography className="text">{name}</Typography>
                    </Grid>

                    <Grid item xs={1}>
                      {description && (
                      <Tooltip title={description}>
                        <span>
                          <FontAwesomeIcon icon={faQuestionCircle} />
                        </span>
                      </Tooltip>
                      )}
                    </Grid>

                    <Grid className={classNames( { editable }, 'keys' )} item xs={6}>
                      {keys[ name ].map( key => (
                        <Button
                          key={key}
                          className={classNames( 'key', { removable: !required } )}
                          disabled={required}
                        >
                          {key}
                        </Button>
                      ) )}

                      <Button variant="outlined" className="new key">Add</Button>

                    </Grid>

                  </Grid>
                </div>
              ) )}
            </div>

          </ListItem>
        ) )}

      <ResetButton group="hotkeys" disabled={!editable} />

    </List>
  )
}

Hotkeys.propTypes = {
  device: string,
  shortcuts: objectOf( shape( { name: string, group: string, description: string } ) ).isRequired,
  keys: objectOf( arrayOf( string ) ).isRequired,
}

Hotkeys.defaultProps = {
  device: null,
}

export default Hotkeys
