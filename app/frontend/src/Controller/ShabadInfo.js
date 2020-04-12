import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { makeStyles, Typography, Popover, IconButton } from '@material-ui/core'

import { ContentContext, WritersContext, RecommendedSourcesContext } from '../lib/contexts'
import { useCurrentLine } from '../lib/hooks'

let isOpen = false

const useStyles = makeStyles( theme => ( {
  typography: {
    padding: theme.spacing( 1.5 ),
  },
} ) )

export default function ShabadInfo() {
  const classes = useStyles()
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
    const { nameEnglish: sectionName } = shabad.section || bani
    const { sourceId, writerId } = shabad || line.shabad
    const { sourcePage } = line
    const { nameEnglish: sourceName, pageNameEnglish: pageName } = recommendedSources[ sourceId ]
    const { nameEnglish: writerName } = writers[ writerId ]
    return [ writerName, sourceName, pageName, sourcePage, sectionName ]
  }
  const [ writerName, sourceName, pageName, sourcePage, sectionName ] = getInfo()
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

        <Typography className={classes.typography}>
            Section:
          {' '}
          {sectionName}
          <br />
            Author:
          {' '}
          {writerName}
          <br />
          {pageName}
          :
          {' '}
          {sourcePage}

          <br />
            Source:
          {' '}
          {sourceName}

          <br />
          Copy Shabad

          <br />
          Open in DB Viewer to report correction
        </Typography>

      </Popover>
    </span>
  )
}
