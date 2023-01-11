import React from 'react'
import { bool, func, string } from 'prop-types'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@material-ui/core'

import './HotkeyDialog.css'

const DeleteHotkeyDialog = ( { open, keyName, name, onClose } ) => (
  <Dialog className="hotkey-dialog" open={open} onClose={() => onClose( false )}>
    <DialogTitle>Delete Hotkey</DialogTitle>

    <DialogContent>

      <DialogContentText color="inherit">
        Are you sure you want to delete this hotkey?
      </DialogContentText>

      <Typography className="hotkey" variant="subtitle2">{`${keyName} (${name})`}</Typography>

    </DialogContent>

    <DialogActions>
      <Button onClick={() => onClose( false )} color="inherit">Cancel</Button>
      <Button className="delete-button" onClick={() => onClose( true )}>Delete</Button>
    </DialogActions>

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
