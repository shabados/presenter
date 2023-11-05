import './ShabadInfo.css'

import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, IconButton, Popover, Tooltip, Typography } from '@mui/material'
import { stripVishraams, toUnicode } from 'gurmukhi-utils'
import { useContext, useRef, useState } from 'react'

import { ContentContext, RecommendedSourcesContext, WritersContext } from '../lib/contexts'
import controller from '../lib/controller'
import { useCopyToClipboard, useCurrentLine, useCurrentLines } from '../lib/hooks'

const popoverDisplay = {
  transformOrigin: { vertical: 'bottom', horizontal: 'center' },
  anchorOrigin: { vertical: 'top', horizontal: 'center' },
}

const getDbViewerUrl = ( lineId: string ) => `https://viewer.shabados.com/line/${lineId}`

const ShabadInfo = () => {
  const iconButtonRef = useRef()

  const [ isPopoverOpen, setPopoverOpen ] = useState( false )

  const { shabad, bani } = useContext( ContentContext )
  const writers = useContext( WritersContext )
  const recommendedSources = useContext( RecommendedSourcesContext )

  const [ line ] = useCurrentLine()
  const lines = useCurrentLines()

  const onClick = () => setPopoverOpen( true )
  const onClose = () => setPopoverOpen( false )

  const copyToClipboard = useCopyToClipboard()

  // Icon changes when open
  const barIcon = isPopoverOpen ? faTimesCircle : faInfoCircle

  const { sourceId, writerId, section } = shabad || line?.shabad || { sourceId: '', writerId: '', section: '' }
  const { nameEnglish: sectionName } = bani || section
  const { id: lineId, sourcePage } = line

  const { nameEnglish: writerName } = writers[ writerId ]
  const { nameEnglish: sourceName, pageNameEnglish: pageName } = recommendedSources[ sourceId ]

  const onCopyClick = () => {
    const gurmukhi = lines.map( ( { gurmukhi } ) => gurmukhi ).join( ' ' )

    copyToClipboard( stripVishraams( toUnicode( gurmukhi ) ) )
  }

  const openViewer = () => controller.openExternalUrl( getDbViewerUrl( lineId ) )

  return (
    <span>
      <IconButton ref={iconButtonRef} variant="contained" onClick={onClick} size="large">
        <FontAwesomeIcon icon={barIcon} />
      </IconButton>

      <Popover
        open={isPopoverOpen}
        onClose={onClose}
        {...popoverDisplay}
        anchorEl={iconButtonRef.current}
      >
        <Typography className="popover-box-text">
          <span className="source-name">{sourceName}</span>
          <span>, </span>
          <span className="page-name">{pageName}</span>
          <span> </span>
          <span className="source-page">{sourcePage}</span>
          <br />
          <span className="section-name">{sectionName}</span>
          <br />
          <span className="writer-name">{writerName}</span>
          <br />

          <div className="popover-buttons">
            <Tooltip title="Report a mistake">
              <Button className="db-viewer button" size="small" onClick={openViewer}>
                Open Online
              </Button>
            </Tooltip>

            <Tooltip title="Click to copy this shabad">
              <Button className="copy-shabad button" size="small" disabled={!shabad} onClick={onCopyClick}>
                Copy
              </Button>
            </Tooltip>
          </div>
        </Typography>
      </Popover>
    </span>
  )
}

export default ShabadInfo
