import React from 'react'
import { bool, func, string } from 'prop-types'

import Dialog from '../../../components/Dialog'

import './HotkeyDialog.css'

const DeleteHotkeyDialog = ( { open, keyName, name, onClose } ) => (
  <Dialog className="hotkey-dialog" open={open} onClose={() => onClose( false )}>
    <div className="dialog-title"><h2>Delete Hotkey</h2></div>

    <div className="dialog-content">
      <p>Are you sure you want to delete this hotkey?</p>
      <p className="hotkey subtitle2">{`${keyName} (${name})`}</p>
    </div>

    <div className="dialog-actions">
      <button type="button" onClick={() => onClose( false )}>Cancel</button>
      <button type="button" className="delete-button" onClick={() => onClose( true )}>Delete</button>
    </div>

  </Dialog>
)

DeleteHotkeyDialog.propTypes = {
  open: bool,
  onClose: func,
  name: string,
  keyName: string,
}

DeleteHotkeyDialog.defaultProps = {
  open: false,
  onClose: () => {},
  name: '',
  keyName: '',
}

export default DeleteHotkeyDialog
