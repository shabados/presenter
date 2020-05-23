import React, { useState, useEffect, useCallback } from 'react'
import { bool, func, string, objectOf } from 'prop-types'
import { recordKeyCombination } from 'react-hotkeys'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@material-ui/core'

import { isMac } from '../../lib/consts'

import './HotkeyDialog.css'

const MODIFIER_MAP = {
  Control: 'ctrl',
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
const SINGLE_MODIFIERS = [ MODIFIER_MAP.Control, MODIFIER_MAP.Alt ]

const AddHotkeyDialog = ( { open, name, onRecorded, assigned } ) => {
  const [ hotkey, setHotkey ] = useState( [] )
  const resetHotkey = useCallback( () => setHotkey( [] ), [ setHotkey ] )

  useEffect( () => {
    setHotkey( [] )
  }, [ open, resetHotkey ] )

  const recordHotkey = useCallback( ( { keys } ) => {
    const recorded = Array.from( new Set( Object
      .keys( keys )
      // Map any modifiers to readable names
      .map( key => MODIFIER_MAP[ key ] || key )
      // Sort by modifiers first
      .sort( ( keyA, keyB ) => (
        ( MODIFIER_ORDER[ keyA ] || keyA.charCodeAt( 0 ) )
      - ( MODIFIER_ORDER[ keyB ] || keyB.charCodeAt( 0 ) )
      ) ) ) )

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

    if ( modifersOnly || shiftWithoutModifier ) return

    //! recordKeyCombinations does not unmount and remount properly if done in same tick
    setImmediate( () => setHotkey( [ ...hotkey, recorded.join( '+' ) ] ) )
  }, [ setHotkey, hotkey ] )

  useEffect( () => recordKeyCombination( recordHotkey ), [ recordHotkey, hotkey ] )

  const hotkeyStr = hotkey.join( ' ' )
  const duplicateOf = assigned[ hotkeyStr ]

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

        {duplicateOf && <Typography align="center" color="error">{`Already mapped to ${duplicateOf}`}</Typography>}

      </DialogContent>

      <DialogActions>
        <Button onClick={() => onRecorded()} color="inherit">Cancel</Button>
        <Button onClick={resetHotkey} color="inherit">Reset</Button>
        <Button disabled={!hotkey.length || !!duplicateOf} onClick={() => onRecorded( hotkeyStr )} color="inherit">Save</Button>
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
