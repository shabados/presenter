import React from 'react'
import { string, func } from 'prop-types'

import { useCopyToClipboard } from '../lib/hooks'

import './CopyButton.css'

const CopyButton = ( { copyText, onClick: originalOnClick, ...props } ) => {
  const copyToClipboard = useCopyToClipboard()

  const onClick = () => {
    originalOnClick()
    copyToClipboard( copyText )
  }

  return (
    <button
      type="button"
      className="copy-button"
      title="Click to copy"
      {...props}
      onClick={onClick}
    />
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
