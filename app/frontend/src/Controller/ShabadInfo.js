import React, { useContext, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Typography, Popover, IconButton, Button, Tooltip } from '@material-ui/core'
import { toUnicode } from 'gurmukhi-utils'

import { ContentContext, WritersContext, RecommendedSourcesContext } from '../lib/contexts'
import { useCurrentLine, useCurrentLines, useCopyToClipboard } from '../lib/hooks'
import controller from '../lib/controller'
import { stripPauses } from '../lib/utils'

import './ShabadInfo.css'

const popoverDisplay = {
  transformOrigin: { vertical: 'bottom', horizontal: 'center' },
  anchorOrigin: { vertical: 'top', horizontal: 'center' },
}

const getDbViewerUrl = lineId => `https://database.shabados.com/line/${lineId}`

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

  const onCopyClick = () => {
    const gurmukhi = lines.map( ( { gurmukhi } ) => gurmukhi ).join( ' ' )

    copyToClipboard( stripPauses( toUnicode( gurmukhi ) ) )
  }

  const { sourceId, writerId, section } = shabad || line.shabad
  const { nameEnglish: sectionName } = bani || section
  const { id: lineId, sourcePage } = line

  const { nameEnglish: writerName } = writers[ writerId ]
  const { nameEnglish: sourceName, pageNameEnglish: pageName } = recommendedSources[ sourceId ]

  return (
    <span>

      <IconButton ref={iconButtonRef} variant="contained" onClick={onClick}>
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

          <div className="popver-buttons">

            <Tooltip title="Report a mistake">
              <Button
                className="db-viewer button"
                size="small"
                onClick={() => controller.openExternalUrl( getDbViewerUrl( lineId ) )}
              >
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
