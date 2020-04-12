import React, { useContext } from 'react'
import { string, func } from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Typography, Popover, IconButton, Button, Tooltip } from '@material-ui/core'
import { toUnicode } from 'gurmukhi-utils'

import { ContentContext, WritersContext, RecommendedSourcesContext } from '../lib/contexts'
import { useCurrentLine, useCopyToClipboard } from '../lib/hooks'
import controller from '../lib/controller'
import { stripPauses } from '../lib/utils'

import './ShabadInfo.css'

let isOpen = false
const CopyShabadButton = ( { copyText, onClick: originalOnClick, ...props } ) => {
  const copyToClipboard = useCopyToClipboard()
  const onClick = () => {
    originalOnClick()
    copyToClipboard( copyText )
  }

  return (
    <Tooltip title="Click to copy current shabad">
      <Button className="copy-shabad-button" size="small" {...props} onClick={onClick}>
        Copy Shabad
      </Button>
    </Tooltip>
  )
}

CopyShabadButton.propTypes = {
  copyText: string,
  onClick: func,
}

CopyShabadButton.defaultProps = {
  copyText: null,
  onClick: () => {},
}

/**
 * Loops through all the lines.
 * @param {Array} shabadLines Array with lines of shabad.
 * @returns Unicode gurmukhi without vishraams.
 */
const copyShabadText = shabadLines => {
  let shabadText = ''
  for ( let i = 0; i < shabadLines.length; i += 1 ) {
    shabadText += shabadLines[ i ].gurmukhi
  }
  return stripPauses( toUnicode( shabadText ) )
}

export default function ShabadInfo() {
  const [ anchorEl, setAnchorEl ] = React.useState( null )

  const handleClick = event => {
    isOpen = true
    setAnchorEl( event.currentTarget )
  }

  const handleClose = () => {
    isOpen = false
    setAnchorEl( null )
  }

  const checkState = () => {
    if ( isOpen ) { return faTimesCircle }
    return faInfoCircle
  }
  const open = Boolean( anchorEl )
  const id = open ? 'simple-popover' : undefined
  const [ line ] = useCurrentLine()
  // Get Shabad, writer, sources for getting the author
  const { shabad, bani } = useContext( ContentContext )
  const writers = useContext( WritersContext )
  const recommendedSources = useContext( RecommendedSourcesContext )
  const getInfo = () => {
    if ( !line ) return ''
    const { nameEnglish: sectionName } = bani || shabad.section
    const { sourceId, writerId } = shabad || line.shabad
    const { id: lineId, sourcePage } = line
    const { nameEnglish: sourceName, pageNameEnglish: pageName } = recommendedSources[ sourceId ]
    const { nameEnglish: writerName } = writers[ writerId ]
    const dbViewerUrl = `https://database.shabados.com/line/${lineId}`
    return [ writerName, sourceName, pageName, sourcePage, sectionName, dbViewerUrl ]
  }
  const [ writerName, sourceName, pageName, sourcePage, sectionName, dbViewerUrl ] = getInfo()
  return (
    <span>
      <IconButton
        variant="contained"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={checkState()} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Typography className="popover-box-text">
          {sourceName}
          {' , '}
          {pageName}
          {' '}
          {sourcePage}
          <br />
          {sectionName}
          <br />
          {writerName}
          <br />
          <Button
            className="db-viewer-button"
            size="small"
            onClick={() => controller.openExternalUrl( dbViewerUrl )}
          >
              Open in DB Viewer
          </Button>
          { shabad && ( <CopyShabadButton copyText={copyShabadText( shabad.lines )} /> ) }
        </Typography>
      </Popover>
    </span>
  )
}