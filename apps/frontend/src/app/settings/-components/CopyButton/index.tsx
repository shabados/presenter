import './index.css'

import { Button, Tooltip } from '@mui/material'

import { useCopyToClipboard } from '~/hooks'

type CopyButtonProps = {
  copyText: string,
  onClick?: () => Record<string, any>,
  children: React.ReactNode,
  style?: Record<string, any>,
}

const CopyButton = (
  { copyText, onClick: originalOnClick = () => ( {} ), ...props }: CopyButtonProps
) => {
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

export default CopyButton
