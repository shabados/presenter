import React, { useState } from 'react'
import { objectOf, arrayOf, string, shape } from 'prop-types'
import { groupBy } from 'lodash'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import controller from '../../lib/controller'
import keyMap from '../../lib/keyMap'
import { mapPlatformKeys } from '../../lib/utils'

import { ResetButton } from '../DynamicOptions'
import AddHotkeyDialog from './AddHotkeyDialog'
import DeleteHotkeyDialog from './DeleteHotkeyDialog'

import './index.css'

const REQUIRED_KEYS = Object
  .values( keyMap )
  .filter( ( { required } ) => required )
  .reduce( ( acc, { sequences, name } ) => ( {
    ...acc,
    ...sequences.reduce( ( acc, key ) => ( { ...acc, [ key ]: name } ), {} ),
  } ), {} )

const Hotkeys = ( { keys, shortcuts, device } ) => {
  const editable = device === 'local'

  const [ editing, setEditing ] = useState()
  const [ deleting, setDeleting ] = useState( {} )

  const mappedKeys = mapPlatformKeys( keys )

  const setRecorded = hotkey => {
    setEditing( null )

    if ( !hotkey ) return

    const { required, sequences } = Object.values( keyMap ).find( ( { name } ) => name === editing )

    const hotkeys = Array.from( new Set( [
      ...( required ? sequences : [] ),
      ...keys[ editing ],
      hotkey,
    ] ) )

    controller.setSettings( { hotkeys: { [ editing ]: hotkeys } } )
  }

  const onDelete = confirmed => {
    setDeleting( {} )

    if ( !confirmed ) return

    const { name, keyName } = deleting

    const { required, sequences } = Object.values( keyMap ).find(
      ( { name: optionName } ) => optionName === name,
    )

    const hotkeys = Array.from( new Set( [
      ...( required ? sequences : [] ),
      ...mappedKeys[ name ],
    ] ) ).filter( key => key !== keyName )

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

      <ul className="hotkeys">
        {Object
          .entries( groupBy( shortcuts, ( { group } ) => group ) )
          .map( ( [ groupName, hotkeys ] ) => (
            <li key={groupName} className="group">

              <span className="name subtitle2">{groupName}</span>

              <div className="group-hotkeys">
                {hotkeys.map( ( { name, description } ) => (
                  <div key={name} className="hotkey">
                    <div className="hotkey-row name">

                      <div className="col-hotkey-name">
                        <span className="text">{name}</span>
                      </div>

                      <div className="col-hotkey-icon">
                        {description && (
                          <span title={description}>
                            <FontAwesomeIcon icon={faQuestionCircle} />
                          </span>
                        )}
                      </div>

                      <div className={classNames( { editable }, 'keys col-hotkey-keys' )}>
                        {mappedKeys[ name ].map( key => (
                          <button
                            key={key}
                            type="button"
                            className={classNames( 'key', { removable: !REQUIRED_KEYS[ key ] } )}
                            disabled={!!REQUIRED_KEYS[ key ]}
                            onClick={
                              () => !REQUIRED_KEYS[ key ] && setDeleting( { keyName: key, name } )
                            }
                          >
                            {key}
                          </button>
                        ) )}

                        <button
                          type="button"
                          className="new key outlined"
                          onClick={() => setEditing( name )}
                        >
                          Add
                        </button>

                      </div>

                    </div>
                  </div>
                ) )}
              </div>

            </li>
          ) )}

        <ResetButton group="hotkeys" disabled={!editable} />

      </ul>

    </>
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
