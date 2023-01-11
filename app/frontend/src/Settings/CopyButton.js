import React from 'react'
import { string, func } from 'prop-types'

import { Button, Tooltip } from '@material-ui/core'

import { useCopyToClipboard } from '../lib/hooks'

import './CopyButton.css'

const CopyButton = ( { copyText, onClick: originalOnClick, ...props } ) => {
  const copyToClipboard = useCopyToClipboard()

  const onClick = () => {
    originalOnClick()
    copyToClipboard( copyText )
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
