import React from 'react'
import { string, func } from 'prop-types'

import copy from 'copy-to-clipboard'
import { Button, Tooltip } from '@material-ui/core'
import { useSnackbar } from 'notistack'

import './CopyButton.css'

const CopyButton = ( { copyText, onClick: originalOnClick, ...props } ) => {
  const { enqueueSnackbar } = useSnackbar()

  const onClick = () => {
    originalOnClick()

    copy( copyText )
    enqueueSnackbar( `Copied ${copyText} to clipboard`, { autoHideDuration: 1000, preventDuplicate: true } )
  }

  return (
    <Tooltip title="Click to copy">
      <Button className="copy-button" {...props} onClick={onClick} />
    </Tooltip>
  )
}

CopyButton.propTypes = {
  copyText: string,
  onClick: func,
}

CopyButton.defaultProps = {
  copyText: null,
  onClick: () => {},
}

export default CopyButton
