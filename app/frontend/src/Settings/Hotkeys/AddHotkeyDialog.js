import React, { useState, useEffect, useCallback } from 'react'
import { bool, func, string, objectOf } from 'prop-types'
import { recordKeyCombination } from 'react-hotkeys'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@material-ui/core'

import { isMac } from '../../lib/consts'
import { RESTRICTED_STROKES } from '../../lib/keyMap'
import { mapPlatformKey } from '../../lib/utils'

import './HotkeyDialog.css'

const MODIFIER_MAP = {
  Control: 'ctrl',
  Command: 'cmd',
  Alt: 'alt',
  AltGraph: 'alt',
  Shift: 'shift',
  Meta: isMac ? 'cmd' : 'win',
  ' ': 'space',
  ArrowDown: 'down',
  ArrowUp: 'up',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Escape: 'esc',
}

const MODIFIER_ORDER = Object.values( MODIFIER_MAP ).reduce( ( acc, name, index ) => ( {
  ...acc,
  [ name ]: index - 1000,
} ), {} )

// Cannot be used without another modifier
const PAIRED_MODIFIERS = [ MODIFIER_MAP.Shift ]

// Can be used without other modifiers
const SINGLE_MODIFIERS = [ MODIFIER_MAP.Control, MODIFIER_MAP.Command, MODIFIER_MAP.Alt ]

const AddHotkeyDialog = ( { open, name, onRecorded, assigned } ) => {
  const [ hotkey, setHotkey ] = useState( [] )
  const [ error, setError ] = useState()
  const resetHotkey = useCallback( () => {
    setHotkey( [] )
    setError( null )
  }, [ setHotkey, setError ] )

  const hotkeyStr = hotkey.join( ' ' )

  useEffect( () => {
    resetHotkey()
  }, [ open, resetHotkey ] )

  const recordHotkey = useCallback( ( { keys } ) => {
    const recorded = Array.from( new Set( Object
      .keys( keys )
      // Map any modifiers to readable names
      .map( key => MODIFIER_MAP[ key ] || key )
      // Make all lowercase
      .map( key => key.toLowerCase() )
      // Sort by modifiers first
      .sort( ( keyA, keyB ) => (
        ( MODIFIER_ORDER[ keyA ] || keyA.charCodeAt( 0 ) )
        - ( MODIFIER_ORDER[ keyB ] || keyB.charCodeAt( 0 ) )
      ) ) ) )

    const recordedStr = recorded.join( '+' )
    const hotkeySequence = [ hotkeyStr, recordedStr ].join( ' ' ).trim()

    // Check for invalid keystrokes
    const invalidKeystroke = RESTRICTED_STROKES
      .map( mapPlatformKey )
      .find( keys => hotkeySequence.includes( keys ) )

    // Check if there are only modifiers
    const modifersOnly = recorded.every( key => [
      ...SINGLE_MODIFIERS,
      ...PAIRED_MODIFIERS,
    ].includes( key ) )

    // Check if there is a shift key without another modify
    const shiftWithoutModifier = (
      recorded.some( key => PAIRED_MODIFIERS.includes( key ) )
      && !recorded.some( key => SINGLE_MODIFIERS.includes( key ) )
    )

    // Check for any duplicated mappings
    const duplicate = assigned[ hotkeySequence ]

    const [ , errorMessage, continueRecording ] = [
      [ invalidKeystroke, `${invalidKeystroke} is a system-wide hotkey that cannot be reserved` ],
      [ shiftWithoutModifier, 'Shift must be combined with another modifier' ],
      [ modifersOnly, `You must combine another key with ${recorded[ 0 ]}` ],
      [ duplicate, `Already mapped to ${duplicate}`, true ],
    ].find( ( [ condition ] ) => condition ) || [ null, null, true ]

    //! recordKeyCombinations does not unmount and remount properly if done in same tick
    setImmediate( () => {
      setError( errorMessage )
      if ( continueRecording ) setHotkey( [ ...hotkey, recordedStr ] )
    } )
  }, [ setHotkey, setError, hotkey, hotkeyStr, assigned ] )

  useEffect( () => recordKeyCombination( recordHotkey ), [ recordHotkey, error, hotkey ] )

  return (
    <Dialog className="hotkey-dialog" open={open} onClose={() => onRecorded()}>
      <DialogTitle>Record Hotkey</DialogTitle>

      <DialogContent>

        <DialogContentText color="inherit">
          Press the desired keys to form a new hotkey for
          <Typography display="inline" variant="caption">{` ${name}`}</Typography>
          .
          Sequences may be defined by pressing combinations in the desired order.
        </DialogContentText>

        <Typography className="hotkey" variant="subtitle2">{hotkey.length ? hotkeyStr : 'Recording...'}</Typography>

        {error && <Typography align="center" color="error">{error}</Typography>}

      </DialogContent>

      <DialogActions>
        <Button onClick={() => onRecorded()} color="inherit">Cancel</Button>
        <Button onClick={resetHotkey} color="inherit">Reset</Button>
        <Button disabled={!hotkey.length || !!error} onClick={() => onRecorded( hotkeyStr )} color="inherit">Save</Button>
      </DialogActions>

    </Dialog>
  )
}

AddHotkeyDialog.propTypes = {
  open: bool,
  onRecorded: func,
  name: string,
  assigned: objectOf( string ).isRequired,
}

AddHotkeyDialog.defaultProps = {
  open: false,
  onRecorded: () => {},
  name: '',
}

export default AddHotkeyDialog
