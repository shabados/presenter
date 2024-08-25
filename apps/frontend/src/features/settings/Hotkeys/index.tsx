import './index.css'

import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Grid,
  List,
  ListItem,
  Tooltip,
  Typography,
} from '@mui/material'
import classNames from 'classnames'
import { groupBy } from 'lodash'
import { useState } from 'react'

import keyMap from '~/helpers/keyMap'
import { mapPlatformKeys } from '~/helpers/utils'
import controller from '~/services/controller'

import { ResetButton } from '../DynamicOptions'
import AddHotkeyDialog from './AddHotkeyDialog'
import DeleteHotkeyDialog from './DeleteHotkeyDialog'

type HotkeysProps = {
  keys: Record<string, string[]>,
  shortcuts: { name: string, group: string, description?: string }[],
  device: string,
}

const REQUIRED_KEYS = Object
  .values( keyMap )
  .filter( ( { required } ) => required )
  .reduce( ( acc, { sequences, name } ) => ( {
    ...acc,
    ...sequences.reduce( ( acc, key ) => ( { ...acc, [ key ]: name } ), {} ),
  } ), {} )

const Hotkeys = ( { keys, shortcuts, device }: HotkeysProps ) => {
  const editable = device === 'local'

  const [ editing, setEditing ] = useState<string | undefined>()
  const [ deleting, setDeleting ] = useState<{ keyName: string, name: string } | {}>()

  const mappedKeys = mapPlatformKeys( keys )

  const setRecorded = ( hotkey: string ) => {
    setEditing( null )

    if ( !hotkey ) return

    const { required, sequences } = Object.values( keyMap ).find( ( { name } ) => name === editing )

    const hotkeys = Array.from( new Set( [
      ...( required ? sequences : [] ),
      ...keys[ editing! ],
      hotkey,
    ] ) )

    controller.setSettings( { hotkeys: { [ editing! ]: hotkeys } } )
  }

  const onDelete = ( confirmed: boolean ) => {
    setDeleting( {} )

    if ( !confirmed ) return

    const { name, keyName } = deleting

    const { required, sequences } = Object.values( keyMap ).find(
      ( { name: optionName } ) => optionName === name,
    )

    const hotkeys = Array.from( new Set( [
      ...( required ? sequences : [] ),
      ...mappedKeys[ name ],
    ] ) ).filter( ( key ) => key !== keyName )

    controller.setSettings( { hotkeys: { [ name ]: hotkeys } } )
  }

  const assignedKeys = Object
    .entries( mappedKeys )
    .reduce( ( acc, [ name, sequences ] ) => ( {
      ...acc,
      ...sequences.reduce( ( acc, key ) => ( { ...acc, [ key ]: name } ), {} ),
    } ), {} )

  return (
    <>

      <AddHotkeyDialog
        open={!!editing}
        name={editing}
        assigned={assignedKeys}
        onRecorded={setRecorded}
      />
      <DeleteHotkeyDialog open={!!deleting.keyName} {...deleting} onClose={onDelete} />

      <List className="hotkeys">
        {Object
          .entries( groupBy( shortcuts, ( { group } ) => group ) )
          .map( ( [ groupName, hotkeys ] ) => (
            <ListItem key={groupName} className="group">

              <Typography className="name" variant="subtitle2">{groupName}</Typography>

              <div className="group-hotkeys">
                {hotkeys.map( ( { name, description } ) => (
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
                        {mappedKeys[ name ].map( ( key ) => (
                          <Button
                            key={key}
                            className={classNames( 'key', { removable: !REQUIRED_KEYS[ key ] } )}
                            disabled={!!REQUIRED_KEYS[ key ]}
                            onClick={
                              () => !REQUIRED_KEYS[ key ] && setDeleting( { keyName: key, name } )
                            }
                          >
                            {key}
                          </Button>
                        ) )}

                        <Button
                          variant="outlined"
                          className="new key"
                          onClick={() => setEditing( name )}
                        >
                          Add
                        </Button>

                      </Grid>

                    </Grid>
                  </div>
                ) )}
              </div>

            </ListItem>
          ) )}

        <ResetButton group="hotkeys" disabled={!editable} />

      </List>

    </>
  )
}

export default Hotkeys
